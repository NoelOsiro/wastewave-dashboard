import { getAllPaymentData, getAllPaymentsBreakdown, getAllPaymentStatusBreakdown } from "@/utils/payments";
import { Suspense } from "react";
import { Metrics } from "./componenents/Metrics";
import { PaymentMethodsChart } from "./componenents/PaymentMethodsChart";
import { PaymentStatus } from "./componenents/PaymentStatus";
import { RevenueChart } from "./componenents/RevenueChart";
export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function PaymentsPage() {
  const payments = await getAllPaymentData();
  const paymentStatusBreakdown = await getAllPaymentStatusBreakdown();
  const paymentsBreakdown = await getAllPaymentsBreakdown();
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
            Track and manage payments from all registered houses.
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
        
        
        {/* <PaymentsTable initialPayments={payments} /> */}
      </div>
  );
}