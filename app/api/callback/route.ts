import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';

interface ApiKey {
  consumer_key: string;
  consumer_secret: string;
  short_code: string;
}

interface C2bResponse {
  ResponseCode: string;
  ResponseDescription: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<C2bResponse | ErrorResponse>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('provider', 'mpesa')
      .single();
    
    if (error) throw new Error(error.message);
    
    const { consumer_key, consumer_secret, short_code } = data as ApiKey;

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

    // C2B registration request
    const c2bResponse = await fetch(
      `${MPESA_BASE_URL}/mpesa/c2b/v1/registerurl`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ShortCode: short_code,
          ResponseType: 'Completed',
          ConfirmationURL: 'https://your-domain.com/api/confirmation',
          ValidationURL: 'https://your-domain.com/api/validation'
        })
      }
    );

    if (!c2bResponse.ok) throw new Error('C2B registration failed');
    const c2bData = await c2bResponse.json() as C2bResponse;

    return NextResponse.json(c2bData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}