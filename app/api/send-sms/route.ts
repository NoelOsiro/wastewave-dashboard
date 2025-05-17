import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const AT_BASE_URL = "https://api.sandbox.africastalking.com/version1/message"; // Use https://api.africastalking.com for production

interface SmsRequest {
  phoneNumber: string; // e.g., "+254712345678"
  message: string;
}

interface SmsResponse {
  SMSMessageData: {
    Message: string;
    Recipients: Array<{
      status: string;
      number: string;
      cost: string;
      messageId: string;
      statusCode: number;
    }>;
  };
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<SmsResponse | ErrorResponse>> {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        provider: 'africastalking',
      },
    });

    if (!apiKey) {
      throw new Error("Africa’s Talking API keys not found");
    }

    const { consumer_key: username, consumer_secret: consumer_secret, initiator_name: from } = apiKey;
    const { phoneNumber, message } = (await request.json()) as SmsRequest;

    // Validate inputs
    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 });
    }
    if (!phoneNumber.match(/^\+254\d{9}$/)) {
      return NextResponse.json(
        { error: "Invalid phone number format (e.g., +254712345678)" },
        { status: 400 }
      );
    }
    if (message.length > 160) {
      return NextResponse.json({ error: "Message must be 160 characters or less" }, { status: 400 });
    }

    // Send SMS via Africa’s Talking
    const smsResponse = await fetch(AT_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        consumer_secret,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        username,
        to: phoneNumber,
        message,
        from, // Optional: Omit if using a default Sender ID
      }).toString(),
    });

    if (!smsResponse.ok) {
      const errorData = await smsResponse.text();
      throw new Error(`SMS request failed: ${errorData}`);
    }

    const smsData = (await smsResponse.json()) as SmsResponse;

    // Check if SMS was accepted
    const recipient = smsData.SMSMessageData.Recipients[0];
    if (recipient.statusCode !== 101 && recipient.statusCode !== 100) {
      return NextResponse.json(
        { error: `SMS failed: ${recipient.status} - ${smsData.SMSMessageData.Message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(smsData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("SMS error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}