import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: string | number }>;
      };
    };
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const callbackData = (await request.json()) as MpesaCallbackBody;
    const { stkCallback } = callbackData.Body;

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Extract metadata (e.g., M-Pesa receipt number)
    const metadata = CallbackMetadata?.Item.reduce(
      (acc, item) => ({ ...acc, [item.Name]: item.Value }),
      {} as Record<string, string | number>
    );

    // Update transaction status in Supabase
    const status = ResultCode === 0 ? "Completed" : "Failed";
    const { error } = await supabase
      .from("transactions")
      .update({
        status,
        result_code: ResultCode,
        result_desc: ResultDesc,
        mpesa_receipt_number: metadata?.MpesaReceiptNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("checkout_request_id", CheckoutRequestID);

    if (error) {
      console.error("Failed to update transaction:", error.message);
      return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
    }

    return NextResponse.json({ message: "Callback processed successfully" });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Callback error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}