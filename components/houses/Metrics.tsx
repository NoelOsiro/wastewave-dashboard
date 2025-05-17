
import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { prisma } from "@/lib/prisma";


export const Metrics = async () => {
  const generators = await prisma.generator.findMany();
  const totalGenerators = generators?.length || 0;
  const activeGenerators = generators?.filter(g => g.status === "Active").length || 0;
  const paymentRate = generators ? `${Math.round((generators.filter(g => g.status === "Paid").length / totalGenerators) * 100)}%` : "0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardMetric title="Total Houses" value={totalGenerators.toString()} description="Fetched from Backend" />
      <DashboardMetric title="Active Houses" value={activeGenerators.toString()} description={`${Math.round((activeGenerators / totalGenerators) * 100)}% of total`} />
      <DashboardMetric title="Payment Rate" value={paymentRate} description="Calculated server-side" />
    </div>
  );
};