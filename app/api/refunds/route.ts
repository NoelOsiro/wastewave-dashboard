import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';

interface ApiKey {
  consumer_key: string;
  consumer_secret: string;
  initiator_name: string; // Add this to api_keys
  security_credential: string; // Encrypted password, provided by Safaricom
}

interface ReversalRequest {
  transactionId: string; // Original M-Pesa transaction ID to reverse
  amount: string;
}

interface ReversalResponse {
  ResponseCode: string;
  ResponseDescription: string;
  ResultCode?: string;
  ResultDesc?: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<ReversalResponse | ErrorResponse>> {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        provider: 'mpesa',
      },
    });
    
    if (!apiKey) throw new Error('Failed to get API key');
    
    const { consumer_key, consumer_secret, initiator_name, security_credential } = apiKey as ApiKey;
    const { transactionId, amount } = await request.json() as ReversalRequest;

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

    // Reversal request
    const reversalResponse = await fetch(
      `${MPESA_BASE_URL}/mpesa/reversal/v1/request`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Initiator: initiator_name,
          SecurityCredential: security_credential,
          CommandID: 'TransactionReversal',
          TransactionID: transactionId,
          Amount: amount,
          ReceiverParty: 'your_short_code', // Your business short code
          RecieverIdentifierType: '11', // 11 for short code
          ResultURL: 'https://your-domain.com/api/reversal-callback',
          QueueTimeOutURL: 'https://your-domain.com/api/timeout',
          Remarks: 'Refund request',
          Occasion: 'Error correction'
        })
      }
    );

    if (!reversalResponse.ok) throw new Error('Reversal failed');
    const reversalData = await reversalResponse.json() as ReversalResponse;

    return NextResponse.json(reversalData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}