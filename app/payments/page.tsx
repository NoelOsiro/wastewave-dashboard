import { Layout } from "@/components/layout/Layout";
import { Suspense } from "react";
import { fetchPayments, fetchPaymentsBreakdown, fetchPaymentStatusBreakdown } from "@/lib/supabase";
import { Metrics } from "./componenents/Metrics";
import { RevenueChart } from "./componenents/RevenueChart";
import { PaymentMethodsChart } from "./componenents/PaymentMethodsChart";
import { PaymentStatus } from "./componenents/PaymentStatus";
import { PaymentsTable } from "./componenents/PaymentsTable";

export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function PaymentsPage() {
  const payments = await fetchPayments();
  const paymentStatusBreakdown = await fetchPaymentStatusBreakdown();
  const paymentsBreakdown = await fetchPaymentsBreakdown();

  return (
    <Layout>
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
            <RevenueChart />
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
    </Layout>
  );
}