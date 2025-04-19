import { createClient } from "@/utils/supabase/server"
import type { BreakdownItem, Payment, StatusBreakdownItem } from "@/lib/types"

export async function getPaymentsData(): Promise<Payment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  return data.map((payment) => ({
    id: payment.id,
    house_id: payment.house_id,
    amount: payment.amount,
    status: payment.status,
    method: payment.method,
    date: payment.date.split("T")[0],
    createdAt: payment.created_at,
    transaction_id: payment.transaction_id,
    house: payment.house,
    owner: payment.owner,
  }))
}

export async function fetchAllPaymentData() {
  const payments = await getPaymentsData()

  // Calculate breakdowns here
  const byMethod: Record<string, number> = {}
  const statusBreakdown = { paid: 0, pending: 0, failed: 0 }

  payments.forEach((p) => {
    const amount = Number(p.amount)
    if (!isNaN(amount)) {
      byMethod[p.method] = (byMethod[p.method] || 0) + amount
    }

    if (p.status === "paid") statusBreakdown.paid++
    else if (p.status === "pending") statusBreakdown.pending++
    else if (p.status === "failed") statusBreakdown.failed++
  })

  const paymentsBreakdown: BreakdownItem[] = Object.entries(byMethod).map(([name, value]) => ({
    name,
    value,
    totalAmount: `${value.toFixed(2)}`,
  }))

  const paymentStatusBreakdown: StatusBreakdownItem[] = [
    { name: "Completed", value: statusBreakdown.paid, totalAmount: `${statusBreakdown.paid} payments` },
    { name: "Pending", value: statusBreakdown.pending, totalAmount: `${statusBreakdown.pending} payments` },
    { name: "Failed", value: statusBreakdown.failed, totalAmount: `${statusBreakdown.failed} payments` },
  ]

  return {
    payments,
    paymentsBreakdown,
    paymentStatusBreakdown,
  }
}
