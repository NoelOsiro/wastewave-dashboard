import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { revenueData } from "@/lib/types";
interface Iprops {
  data:{name:string,value:number}[]
}

export const RevenueChart = (props:Iprops) => {
  return (
    <DashboardChart
      title="Revenue Trend"
      data={props.data}
      dataKeys={["value"]}
      type="area"
      height={250}
      className="lg:col-span-2"
      showLegend={false}
      strokeWidth={3}
    />
  );
};