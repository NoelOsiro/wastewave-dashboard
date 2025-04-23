import { Layout } from "@/components/layout/Layout";
import { Suspense, use } from "react";
import { fetchPayments, fetchPaymentsBreakdown, fetchPaymentStatusBreakdown } from "@/lib/supabase";
import { Metrics } from "@/components/payments/Metrics";
import { RevenueChart } from "@/components/payments/RevenueChart";
import { PaymentStatus } from "@/components/payments/PaymentStatus";
import { PaymentMethodsChart } from "@/components/payments/PaymentMethodsChart";
import { PaymentsTable } from "@/components/payments/PaymentsTable";



export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function PaymentsPage() {
  const payments = await fetchPayments();
  const paymentStatusBreakdown = await fetchPaymentStatusBreakdown();
  const paymentsBreakdown = await fetchPaymentsBreakdown();
  const userData = {
    name: "Waste Admin",
    email: "admin@wastewave.com",
    role: "house",
    image: "https://images.unsplash.com/photo-1502685104226-e9b3c4f2e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  }

  return (
      <div className="space-y-8">
      <div>
          <h1 className="font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage payments from all registered members.
          </p>
        </div>
        { userData.role ==="admin" && (
          <>
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
        </>
        )}
        
        
        <PaymentsTable initialPayments={payments} />
      </div>
  );
}