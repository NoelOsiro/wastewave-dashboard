// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { getMetricsComponent } from "@/lib/dashboard/metrics"; // Fixed import path
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar } from "lucide-react"; // Import types
import { DashboardData, UserRole } from "@/lib/types";
import { getDashboardData } from "@/lib/queriest";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div className="text-center text-red-500">Error: Unable to fetch user data</div>;
  }

  const role = (user.user_metadata.role as UserRole) || UserRole.House; // Fallback to 'house' if role is undefined
  const dashboardData: DashboardData = await getDashboardData(role, user.id);
  const metricsComponent = getMetricsComponent(role);

  const {
    revenueData,
    wasteCollectionData,
    scheduleData,
    recentPayments,
    upcomingCollections,
    topPerformers,
  } = dashboardData;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back to WasteWave. Here is what is happening today.</p>
      </div>

      {/* Metrics */}
      {metricsComponent && <div>{metricsComponent}</div>}

      {/* Charts */}
      {(revenueData.length > 0 || wasteCollectionData.length > 0) && (
        <div className={`grid grid-cols-1 ${role === UserRole.Recycler ? "lg:grid-cols-2" : ""} gap-6`}>
          {role !== UserRole.Generator && revenueData.length > 0 && (
            <DashboardChart title="Revenue Overview" data={revenueData} dataKeys={["revenue"]} type="area" />
          )}
          {wasteCollectionData.length > 0 && (
            <DashboardChart title="Waste Collection by Type" data={wasteCollectionData} dataKeys={["value"]} type="pie" />
          )}
        </div>
      )}

      {/* Schedule and Payments */}
      {(scheduleData.length > 0 || recentPayments.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scheduleData.length > 0 && (
            <DashboardChart
              title="Collection Schedule"
              data={scheduleData}
              dataKeys={["completed", "pending"]}
              colors={["#3aa945", "#f59e0b"]}
              type="bar"
            />
          )}
          {recentPayments.length > 0 && (
            <DashboardCard title="Recent Payments">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">House</th>
                      <th className="text-left py-3 font-medium">Amount</th>
                      <th className="text-left py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="py-3">{payment.house}</td>
                        <td className="py-3">{payment.amount}</td>
                        <td className="py-3">
                          <span
                            className={`status-badge ${
                              payment.status === "Paid" ? "status-badge-success" : "status-badge-warning"
                            }`}
                            aria-label={`Payment status: ${payment.status}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          )}
        </div>
      )}

      {/* Collections and Performers */}
      {(upcomingCollections.length > 0 || topPerformers.length > 0) && (
        <div className={`grid grid-cols-1 ${role === UserRole.Recycler ? "lg:grid-cols-2" : ""} gap-6`}>
          {upcomingCollections.length > 0 && (
            <DashboardCard title="Upcoming Collections">
              <div className="space-y-4">
                {upcomingCollections.slice(0, 4).map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar
                        className="text-primary"
                        size={20}
                        aria-label="Collection calendar icon"
                      />
                      <div>
                        <p className="font-medium">{collection.house}</p>
                        <p className="text-sm text-muted-foreground">{collection.date}</p>
                      </div>
                    </div>
                    <span
                      className="status-badge status-badge-info"
                      aria-label={`Collection status: ${collection.status}`}
                    >
                      {collection.status}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}
          {role !== UserRole.Generator && topPerformers.length > 0 && (
            <DashboardCard title="Top Performers">
              <div className="space-y-4">
                {topPerformers.slice(0, 3).map((performer, index) => (
                  <div key={performer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{performer.house}</p>
                        <p className="text-sm text-muted-foreground">
                          Separation Rate: {performer.wasteSeparation}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold text-primary">{performer.points} pts</div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}
        </div>
      )}
    </div>
  );
}