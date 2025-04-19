import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { BreakdownItem } from "@/lib/types";


type PaymentMethodsChartProps = {
  paymentsBreakdown: BreakdownItem[];
};

export const PaymentMethodsChart = ({ paymentsBreakdown }: PaymentMethodsChartProps) => {
  const totalPayments = paymentsBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardCard title="Payment Methods" className="lg:col-span-1">
      <DashboardChart
        title=""
        data={paymentsBreakdown}
        dataKeys={["value"]}
        type="pie"
        height={220}
        showLegend={true}
      />
      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        {paymentsBreakdown.map((item, index) => {
          const percentage = totalPayments > 0 ? ((item.value / totalPayments) * 100).toFixed(1) : 0;
          return (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/30 border border-muted"
            >
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-2xl font-bold mt-1">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};