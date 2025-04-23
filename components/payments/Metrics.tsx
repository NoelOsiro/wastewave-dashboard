import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { BreakdownItem } from "@/lib/types";


type MetricsProps = {
  paymentStatusBreakdown: BreakdownItem[];
  paymentsBreakdown: BreakdownItem[];
};

export const Metrics = ({ paymentStatusBreakdown, paymentsBreakdown }: MetricsProps) => {
  const totalPayments = paymentsBreakdown.reduce((sum, item) => sum + item.value, 0);
  const paidStatus = paymentStatusBreakdown.find((item) => item.name === "Completed");
  const averagePaid =
    paidStatus && paidStatus.value > 0
      ? (parseFloat(paidStatus.totalAmount) / paidStatus.value).toFixed(2)
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardMetric
        title="Total Revenue"
        value={totalPayments > 0 ? `Kes ${paymentStatusBreakdown[1]?.totalAmount}` : "$0"}
        description="This month"
        trend={{ value: 12, isPositive: true }}
      />
      <DashboardMetric
        title="Outstanding Amount"
        value={totalPayments > 0 ? `Kes ${paymentStatusBreakdown[0]?.totalAmount}` : "$0"}
        description="28 invoices pending"
        trend={{ value: 5, isPositive: false }}
      />
      <DashboardMetric
        title="Payment Rate"
        value={totalPayments > 0 ? ((5 / totalPayments) * 100).toFixed(1) : "0"}
        description="Up from 82% last month"
        trend={{ value: 5, isPositive: true }}
      />
      <DashboardMetric
        title="Average Payment"
        value={totalPayments > 0 ? `Kes ${averagePaid}` : "$0"}
        description="Per household"
      />
    </div>
  );
};