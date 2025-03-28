import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use live URL for production

interface ApiKey {
  consumer_key: string;
  consumer_secret: string;
  short_code: string; // Add this to your Supabase api_keys table
  passkey: string;    // Add this too, provided by Safaricom
}

interface StkPushRequest {
  phoneNumber: string;
  amount: string;
}

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<StkPushResponse | ErrorResponse>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('provider', 'mpesa')
      .single();
    
    if (error) throw new Error(error.message);
    
    const { consumer_key, consumer_secret, short_code, passkey } = data as ApiKey;
    const { phoneNumber, amount } = await request.json() as StkPushRequest;

    // Generate access token
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    const tokenResponse = await fetch(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: { Authorization: `Basic ${auth}` }
      }
    );
    if (!tokenResponse.ok) throw new Error('Failed to get access token');
    const { access_token } = await tokenResponse.json();

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${short_code}${passkey}${timestamp}`).toString('base64');

    // STK Push request
    const stkResponse = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: short_code,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber, // Customer's phone
          PartyB: short_code,   // Your short code
          PhoneNumber: phoneNumber,
          CallBackURL: 'https://your-domain.com/api/callback', // Your callback endpoint
          AccountReference: 'Test123',
          TransactionDesc: 'Payment for services'
        })
      }
    );

    if (!stkResponse.ok) throw new Error('STK Push failed');
    const stkData = await stkResponse.json() as StkPushResponse;

    return NextResponse.json(stkData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}