import { DashboardMetric } from "@/components/dashboard/DashboardMetric"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { Home as HomeIcon, Truck, CreditCard, Award, Calendar } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { createClient } from "@/utils/supabase/server"
import TransporterMetrics from "@/components/dashboard/metrics/transporter_metrics copy"
import DisposerMetrics from "@/components/dashboard/metrics/disposer_metrics copy 3"
import GeneratorMetrics from "@/components/dashboard/metrics/generator_metrics copy 2"
import RecyclerMetrics from "@/components/dashboard/metrics/recycler_metrics"

const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
]

const wasteCollectionData = [
    { name: "Plastic", value: 400 },
    { name: "Paper", value: 300 },
    { name: "Organic", value: 500 },
    { name: "Metal", value: 200 },
    { name: "Glass", value: 278 },
]

const scheduleData = [
    { name: "Mon", completed: 24, pending: 5 },
    { name: "Tue", completed: 20, pending: 3 },
    { name: "Wed", completed: 27, pending: 2 },
    { name: "Thu", completed: 25, pending: 4 },
    { name: "Fri", completed: 18, pending: 6 },
    { name: "Sat", completed: 15, pending: 3 },
    { name: "Sun", completed: 0, pending: 0 },
]

const recentPayments = [
    { id: 1, house: "Garcia Residence", amount: "$35.00", method: "M-Pesa", status: "Paid", date: "1 hour ago" },
    { id: 2, house: "Patel Family", amount: "$42.50", method: "SasaPay", status: "Paid", date: "3 hours ago" },
    { id: 3, house: "Wilson Home", amount: "$35.00", method: "M-Pesa", status: "Pending", date: "5 hours ago" },
    { id: 4, house: "Ohing Compound", amount: "$50.00", method: "SasaPay", status: "Paid", date: "1 day ago" },
    { id: 5, house: "Silva Apartment", amount: "$28.00", method: "M-Pesa", status: "Pending", date: "1 day ago" },
]

const upcomingCollections = [
    { id: 1, house: "Green Valley Estate", date: "Tomorrow, 9:00 AM", status: "Scheduled" },
    { id: 2, house: "Sunset Apartments", date: "Tomorrow, 11:30 AM", status: "Scheduled" },
    { id: 3, house: "Riverside Heights", date: "Wed, 8:00 AM", status: "Scheduled" },
    { id: 4, house: "Mountain View Homes", date: "Wed, 1:00 PM", status: "Scheduled" },
    { id: 5, house: "Golden Gate Residences", date: "Thu, 10:00 AM", status: "Scheduled" },
]

const topPerformers = [
    { id: 1, house: "Ngugi Family", points: 520, wasteSeparation: "98%" },
    { id: 2, house: "Chen Residence", points: 480, wasteSeparation: "96%" },
    { id: 3, house: "Johnson Home", points: 455, wasteSeparation: "95%" },
    { id: 4, house: "Akbar Compound", points: 430, wasteSeparation: "93%" },
    { id: 5, house: "Martinez Family", points: 405, wasteSeparation: "91%" },
]
const getDasboardData = async (role: string) => {
    switch (role) {
        case "admin":
            return {
                revenueData,
                wasteCollectionData,
                scheduleData,
                recentPayments,
                upcomingCollections,
                topPerformers,
            }
        case "house":
            return {
                revenueData: [],
                wasteCollectionData: wasteCollectionData,
                scheduleData: scheduleData,
                recentPayments: recentPayments,
                upcomingCollections: upcomingCollections,
                topPerformers: [],
            }
        case "collector":
            return {
                revenueData: [],
                wasteCollectionData: [],
                scheduleData: [],
                recentPayments: [],
                upcomingCollections: [],
                topPerformers: [],
            }
        case "manager":
            return {
                revenueData: [],
                wasteCollectionData: [],
                scheduleData: [],
                recentPayments: [],
                upcomingCollections: [],
                topPerformers: [],
            }
        default:
            return {
                revenueData,
                wasteCollectionData,
                scheduleData,
                recentPayments,
                upcomingCollections,
                topPerformers,
            }
    }
}

const getMetricsComponent = (role?: string) => {
    switch (role) {
        case "transporter":
            return (
                <TransporterMetrics />
            )
        case "generator":
            return (
                <GeneratorMetrics />

            )
        case "disposer":
            return (

                    <DisposerMetrics />

            )
        case "recycler":
            return (

                    <RecyclerMetrics />

            )
        default:
            return null
    }
}

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const metricsComponent = getMetricsComponent(user?.user_metadata.role)
    const { 
        revenueData, 
        wasteCollectionData, 
        scheduleData, 
        recentPayments,
        upcomingCollections, 
        topPerformers 
    } = await getDasboardData(user?.user_metadata.role)
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-semibold tracking-tight">My Environment</h1>
                <p className="text-muted-foreground mt-1">Welcome back to WasteWave. Here is what is happening today.</p>
            </div>

            {/* Metrics */}
            {metricsComponent}

            {/* Charts */}
            <div className={`grid grid-cols-1 ${user?.user_metadata.role != "recycler" ? "" : "lg:grid-cols-2"}  gap-6`}>
                {user?.user_metadata.role != "generator" && (
                    <DashboardChart title="Revenue Overview" data={revenueData} dataKeys={["revenue"]} type="area" />
                )}
                <DashboardChart title="Waste Collection by Type" data={wasteCollectionData} dataKeys={["value"]} type="pie" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardChart
                    title="Collection Schedule"
                    data={scheduleData}
                    dataKeys={["completed", "pending"]}
                    colors={["#3aa945", "#f59e0b"]}
                    type="bar"
                />

                {/* Recent Payments */}
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
                                                className={`status-badge ${payment.status === "Paid" ? "status-badge-success" : "status-badge-warning"
                                                    }`}
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
            </div>

            <div className={`grid grid-cols-1 ${user?.user_metadata.role != "recycler" ? "" : "lg:grid-cols-2"}  gap-6`}>
                {/* Upcoming Collections */}
                <DashboardCard title="Upcoming Collections">
                    <div className="space-y-4">
                        {upcomingCollections.slice(0, 4).map((collection) => (
                            <div key={collection.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Calendar className="text-primary" size={20} />
                                    <div>
                                        <p className="font-medium">{collection.house}</p>
                                        <p className="text-sm text-muted-foreground">{collection.date}</p>
                                    </div>
                                </div>
                                <span className="status-badge status-badge-info">{collection.status}</span>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* Top Performers */}
                {user?.user_metadata.role != "generator" && (
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
                                            <p className="text-sm text-muted-foreground">Separation Rate: {performer.wasteSeparation}</p>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-primary">{performer.points} pts</div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                )}
            </div>
        </div>
    )
}
