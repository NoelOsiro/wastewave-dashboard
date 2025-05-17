import { prisma } from "@/lib/prisma";
import { MpesaCallbackBody, MpesaMetadata } from "@/lib/types";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const callbackData = (await request.json()) as MpesaCallbackBody;
    const { stkCallback } = callbackData.Body;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Extract metadata
    const metadata: MpesaMetadata = CallbackMetadata?.Item?.reduce(
      (acc, item) => ({ ...acc, [item.Name]: item.Value }),
      {} as MpesaMetadata
    ) || {} as MpesaMetadata;

    // Update transaction status in Prisma
    const status = ResultCode === 0 ? "Completed" : "Failed";

    const updatedTransaction = await prisma.mpesaTransaction.update({
      where: { checkoutRequestId: CheckoutRequestID },
      data: {
        status,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        mpesaReceiptNumber: metadata.MpesaReceiptNumber?.toString() || null,
        transactionDate: metadata.TransactionDate
          ? new Date(metadata.TransactionDate.toString())
          : undefined,
        phoneNumber: metadata.PhoneNumber?.toString() || undefined,
        amount: metadata.Amount ? Number(metadata.Amount) : undefined,
      },
    });

    if (!updatedTransaction) {
      console.error("Transaction not found for CheckoutRequestID:", CheckoutRequestID);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Callback processed successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Callback error:", errorMessage, { error });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}