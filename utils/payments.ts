import { prisma } from "@/lib/prisma";
import type { BreakdownItem, Payment, StatusBreakdownItem } from "@/lib/types";

export async function getPaymentsData(): Promise<Payment[]> {
  try {
    const payments = await prisma.mpesaTransaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        mpesaTransactionId: true,
        amount: true,
        status: true,
        transactionDate: true,
        phoneNumber: true,
        payer: {
          select: {
            name: true,
            email: true,
          },
        },
        collectionRequest: {
          select: {
            generator: {
              select: {
                id: true,
                address: true,
              },
            },
          },
        },
      },
    });

    return payments.map((payment) => ({
      id: payment.id,
      transaction_id: payment.mpesaTransactionId,
      amount: payment.amount,
      method: payment.phoneNumber.includes("254") ? "M-Pesa" : "Unknown", // Derive method
      status: payment.status,
      date: payment.transactionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      house_id: payment.collectionRequest?.generator?.id || "",
      house: payment.collectionRequest?.generator?.address || "Unknown",
      owner: payment.payer.name || payment.payer.email || "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

export async function fetchAllPaymentData() {
  const payments = await getPaymentsData();

  // Calculate breakdowns
  const byMethod: Record<string, number> = {};
  const statusBreakdown = { paid: 0, pending: 0, failed: 0 };
  const byDate: Record<string, number> = {};

  payments.forEach((p) => {
    const amount = Number(p.amount);
    if (!isNaN(amount)) {
      byMethod[p.method] = (byMethod[p.method] || 0) + amount;
      byDate[p.date] = (byDate[p.date] || 0) + amount;
    }

    if (p.status.toLowerCase() === "completed") statusBreakdown.paid++;
    else if (p.status.toLowerCase() === "pending") statusBreakdown.pending++;
    else if (p.status.toLowerCase() === "failed") statusBreakdown.failed++;
  });

  const paymentsBreakdown: BreakdownItem[] = Object.entries(byMethod).map(([name, value]) => ({
    name,
    value,
    totalAmount: `${value.toFixed(2)}`,
  }));

  const paymentStatusBreakdown: StatusBreakdownItem[] = [
    { name: "Completed", value: statusBreakdown.paid, totalAmount: `${statusBreakdown.paid} payments` },
    { name: "Pending", value: statusBreakdown.pending, totalAmount: `${statusBreakdown.pending} payments` },
    { name: "Failed", value: statusBreakdown.failed, totalAmount: `${statusBreakdown.failed} payments` },
  ];

  const paymentsDateBreakdown = Object.entries(byDate).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    payments,
    paymentsBreakdown,
    paymentStatusBreakdown,
    paymentsDateBreakdown,
  };
}

export async function getAllPaymentData() {
  const payments = await fetchAllPaymentData();
  return payments;
}

export async function getAllPaymentStatusBreakdown() {
  const payments = await fetchAllPaymentData();
  return payments.paymentStatusBreakdown;
}

export async function getAllPaymentsBreakdown() {
  const payments = await fetchAllPaymentData();
  return payments.paymentsBreakdown;
}
