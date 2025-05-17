import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MPESA_BASE_URL = "https://sandbox.safaricom.co.ke"; // Switch to live URL in production


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
    const apiKeyData = await prisma.apiKey.findFirst({
      where: {
        provider: "mpesa",
      },
    });

    if (!apiKeyData) {
      throw new Error("M-Pesa API keys not found");
    }

    const { consumer_key, consumer_secret, initiator_name, security_credential } = apiKeyData
    const { phoneNumber, amount } = (await request.json()) as StkPushRequest;

    // Validate inputs
    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: "Phone number and amount are required" }, { status: 400 });
    }
    if (!phoneNumber.match(/^2547\d{8}$/)) {
      return NextResponse.json({ error: "Invalid phone number format (e.g., 2547XXXXXXXX)" }, { status: 400 });
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    // Generate access token
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64");
    const tokenResponse = await fetch(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }
    const { access_token } = await tokenResponse.json();

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${initiator_name}${security_credential}${timestamp}`).toString("base64");

    // STK Push request
    const stkResponse = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: initiator_name,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: initiator_name,
        PhoneNumber: phoneNumber,
        CallBackURL: "https://wastewave-dashboard.vercel.app/api/callback", // Replace with your actual callback URL
        AccountReference: "Test123",
        TransactionDesc: "Payment for services",
      }),
    });

    const stkData = (await stkResponse.json()) as StkPushResponse;

    // Handle the response
    if (stkData.ResponseCode !== "0") {
      return NextResponse.json(
        { error: `STK Push failed: ${stkData.ResponseDescription}` },
        { status: 400 }
      );
    }

    // Store the transaction details in Supabase for tracking
    // const { error: insertError } = await prisma.mpesaTransaction.create({
    //   merchant_request_id: stkData.MerchantRequestID,
    //   checkout_request_id: stkData.CheckoutRequestID,
    //   phone_number: phoneNumber,
    //   amount: Number(amount),
    //   status: "Pending", // Initial status; update via callback
    //   created_at: new Date().toISOString(),
    // });

    // if (insertError) {
    //   console.error("Failed to store transaction:", insertError.message);
    //   // Don't fail the request, just log the error
    // }

    // Return success response to the client
    return NextResponse.json(stkData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("STK Push error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}