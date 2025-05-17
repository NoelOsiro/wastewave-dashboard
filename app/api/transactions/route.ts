import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';

interface ApiKey {
  consumer_key: string;
  consumer_secret: string;
  initiator_name: string;
  security_credential: string;
}

interface StatusRequest {
  checkoutRequestId: string; // From STK Push response
}

interface StatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  ResultCode: string;
  ResultDesc: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<StatusResponse | ErrorResponse>> {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        provider: 'mpesa'
      }
    });
    
    if (!apiKey) throw new Error('API key not found');
    
    const { consumer_key, consumer_secret, initiator_name, security_credential } = apiKey as ApiKey;
    const { checkoutRequestId } = await request.json() as StatusRequest;

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

    // Transaction status request
    const statusResponse = await fetch(
      `${MPESA_BASE_URL}/mpesa/transactionstatus/v1/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Initiator: initiator_name,
          SecurityCredential: security_credential,
          CommandID: 'TransactionStatusQuery',
          TransactionID: checkoutRequestId,
          PartyA: 'your_short_code',
          IdentifierType: '4', // 4 for PayBill/Till
          ResultURL: 'https://your-domain.com/api/status-callback',
          QueueTimeOutURL: 'https://your-domain.com/api/timeout',
          Remarks: 'Status check'
        })
      }
    );

    if (!statusResponse.ok) throw new Error('Status query failed');
    const statusData = await statusResponse.json() as StatusResponse;

    return NextResponse.json(statusData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}