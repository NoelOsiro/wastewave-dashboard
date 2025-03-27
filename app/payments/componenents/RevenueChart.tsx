import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { revenueData } from "@/lib/types";


export const RevenueChart = () => {
  return (
    <DashboardChart
      title="Revenue Trend"
      data={revenueData}
      dataKeys={["revenue"]}
      type="area"
      height={250}
      className="lg:col-span-2"
      showLegend={false}
      strokeWidth={3}
    />
  );
};