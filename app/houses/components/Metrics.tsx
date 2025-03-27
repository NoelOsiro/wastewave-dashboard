
import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { createClient } from "@/utils/supabase/server";


export const Metrics = async () => {
  const supabase = await createClient();
  const { data: houses } = await supabase.from("houses").select("*");
  const totalHouses = houses?.length || 0;
  const activeHouses = houses?.filter(h => h.status === "Active").length || 0;
  const paymentRate = houses ? `${Math.round((houses.filter(h => h.payment_status === "Paid").length / totalHouses) * 100)}%` : "0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardMetric title="Total Houses" value={totalHouses.toString()} description="Fetched from Supabase" />
      <DashboardMetric title="Active Houses" value={activeHouses.toString()} description={`${Math.round((activeHouses / totalHouses) * 100)}% of total`} />
      <DashboardMetric title="Payment Rate" value={paymentRate} description="Calculated server-side" />
    </div>
  );
};