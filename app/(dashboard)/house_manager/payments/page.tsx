import { Metrics } from "@/components/payments/Metrics";
import { PaymentMethodsChart } from "@/components/payments/PaymentMethodsChart";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentStatus } from "@/components/payments/PaymentStatus";
import { RevenueChart } from "@/components/payments/RevenueChart";
import { fetchAllPaymentData } from "@/utils/payments";
import { Suspense } from "react";



export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function PaymentsPage() {
  const { payments, paymentsBreakdown, paymentStatusBreakdown, paymentsDateBreakdown } = await fetchAllPaymentData()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage payments from all registered houses.
        </p>
      </div>
          <Suspense fallback={<div>Loading metrics...</div>}>
            <Metrics
              paymentStatusBreakdown={paymentStatusBreakdown}
              paymentsBreakdown={paymentsBreakdown}
            />
          </Suspense>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Suspense fallback={<div>Loading revenue chart...</div>}>
              <RevenueChart data={paymentsDateBreakdown}/>
            </Suspense>
            <Suspense fallback={<div>Loading payment methods...</div>}>
              <PaymentMethodsChart paymentsBreakdown={paymentsBreakdown} />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading payment status...</div>}>
            <PaymentStatus paymentStatusBreakdown={paymentStatusBreakdown} />
          </Suspense>
      <PaymentsTable initialPayments={payments} />
    </div>
  );
}