// lib/supabase/queries.ts
import { createClient } from "@/utils/supabase/server";
import { DashboardData, UserRole } from "./types";


// Fallback hardcoded data (for testing or if DB is empty)
const fallbackData: DashboardData = {
  revenueData: [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
  ],
  wasteCollectionData: [
    { name: "Plastic", value: 400 },
    { name: "Paper", value: 300 },
    { name: "Organic", value: 500 },
    { name: "Metal", value: 200 },
    { name: "Glass", value: 278 },
  ],
  scheduleData: [
    { name: "Mon", completed: 24, pending: 5 },
    { name: "Tue", completed: 20, pending: 3 },
    { name: "Wed", completed: 27, pending: 2 },
    { name: "Thu", completed: 25, pending: 4 },
    { name: "Fri", completed: 18, pending: 6 },
    { name: "Sat", completed: 15, pending: 3 },
    { name: "Sun", completed: 0, pending: 0 },
  ],
  recentPayments: [
    { id: 1, house: "Garcia Residence", amount: "$35.00", method: "M-Pesa", status: "Paid", date: "1 hour ago" },
    { id: 2, house: "Patel Family", amount: "$42.50", method: "SasaPay", status: "Paid", date: "3 hours ago" },
    { id: 3, house: "Wilson Home", amount: "$35.00", method: "M-Pesa", status: "Pending", date: "5 hours ago" },
    { id: 4, house: "Ohing Compound", amount: "$50.00", method: "SasaPay", status: "Paid", date: "1 day ago" },
    { id: 5, house: "Silva Apartment", amount: "$28.00", method: "M-Pesa", status: "Pending", date: "1 day ago" },
  ],
  upcomingCollections: [
    { id: 1, house: "Green Valley Estate", date: "Tomorrow, 9:00 AM", status: "Scheduled" },
    { id: 2, house: "Sunset Apartments", date: "Tomorrow, 11:30 AM", status: "Scheduled" },
    { id: 3, house: "Riverside Heights", date: "Wed, 8:00 AM", status: "Scheduled" },
    { id: 4, house: "Mountain View Homes", date: "Wed, 1:00 PM", status: "Scheduled" },
    { id: 5, house: "Golden Gate Residences", date: "Thu, 10:00 AM", status: "Scheduled" },
  ],
  topPerformers: [
    { id: 1, house: "Ngugi Family", points: 520, wasteSeparation: "98%" },
    { id: 2, house: "Chen Residence", points: 480, wasteSeparation: "96%" },
    { id: 3, house: "Johnson Home", points: 455, wasteSeparation: "95%" },
    { id: 4, house: "Akbar Compound", points: 430, wasteSeparation: "93%" },
    { id: 5, house: "Martinez Family", points: 405, wasteSeparation: "91%" },
  ],
};

export async function getDashboardData(role: UserRole, userId: string): Promise<DashboardData> {
  const supabase = await createClient();

  try {
    switch (role) {
      case UserRole.Admin:
        // Fetch all data for admin
        const [revenueRes, wasteRes, scheduleRes, paymentsRes, collectionsRes, performersRes] = await Promise.all([
          supabase.from("revenue").select("*").limit(7),
          supabase.from("waste_collections").select("*").limit(5),
          supabase.from("schedules").select("*").limit(7),
          supabase.from("payments").select("*").order("date", { ascending: false }).limit(5),
          supabase.from("collections").select("*").order("date", { ascending: true }).limit(5),
          supabase.from("performers").select("*").order("points", { ascending: false }).limit(5),
        ]);

        if (revenueRes.error || wasteRes.error || scheduleRes.error || paymentsRes.error || collectionsRes.error || performersRes.error) {
          throw new Error("Failed to fetch admin data");
        }

        return {
          revenueData: revenueRes.data || fallbackData.revenueData,
          wasteCollectionData: wasteRes.data || fallbackData.wasteCollectionData,
          scheduleData: scheduleRes.data || fallbackData.scheduleData,
          recentPayments: paymentsRes.data || fallbackData.recentPayments,
          upcomingCollections: collectionsRes.data || fallbackData.upcomingCollections,
          topPerformers: performersRes.data || fallbackData.topPerformers,
        };

      case UserRole.House:
        // Fetch house-specific data
        const [housePaymentsRes, houseCollectionsRes] = await Promise.all([
          supabase.from("payments").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(5),
          supabase.from("collections").select("*").eq("user_id", userId).order("date", { ascending: true }).limit(5),
        ]);

        if (housePaymentsRes.error || houseCollectionsRes.error) {
          throw new Error("Failed to fetch house data");
        }

        return {
          revenueData: [], // Houses don't see revenue
          wasteCollectionData: fallbackData.wasteCollectionData, // Could fetch user-specific waste data
          scheduleData: fallbackData.scheduleData, // Could fetch user-specific schedules
          recentPayments: housePaymentsRes.data || fallbackData.recentPayments,
          upcomingCollections: houseCollectionsRes.data || fallbackData.upcomingCollections,
          topPerformers: [], // Houses don't see performers
        };

      case UserRole.Collector:
        // Fetch collector-specific data
        const [collectorCollectionsRes] = await Promise.all([
          supabase.from("collections").select("*").eq("collector_id", userId).order("date", { ascending: true }).limit(5),
        ]);

        if (collectorCollectionsRes.error) {
          throw new Error("Failed to fetch collector data");
        }

        return {
          revenueData: [],
          wasteCollectionData: fallbackData.wasteCollectionData, // Could fetch collector-specific waste data
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: collectorCollectionsRes.data || fallbackData.upcomingCollections,
          topPerformers: [],
        };

      case UserRole.Manager:
        // Fetch manager-specific data
        const [managerCollectionsRes, managerPerformersRes] = await Promise.all([
          supabase.from("collections").select("*").eq("manager_id", userId).order("date", { ascending: true }).limit(5),
          supabase.from("performers").select("*").eq("manager_id", userId).order("points", { ascending: false }).limit(5),
        ]);

        if (managerCollectionsRes.error || managerPerformersRes.error) {
          throw new Error("Failed to fetch manager data");
        }

        return {
          revenueData: [],
          wasteCollectionData: [],
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: managerCollectionsRes.data || fallbackData.upcomingCollections,
          topPerformers: managerPerformersRes.data || fallbackData.topPerformers,
        };

      case UserRole.Transporter:
      case UserRole.Generator:
      case UserRole.Disposer:
      case UserRole.Recycler:
        // Fetch role-specific data (placeholder, adjust as needed)
        const [roleCollectionsRes] = await Promise.all([
          supabase.from("collections").select("*").eq("role_id", userId).order("date", { ascending: true }).limit(5),
        ]);

        if (roleCollectionsRes.error) {
          throw new Error(`Failed to fetch ${role} data`);
        }

        return {
          revenueData: [],
          wasteCollectionData: fallbackData.wasteCollectionData, // Adjust based on role
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: roleCollectionsRes.data || fallbackData.upcomingCollections,
          topPerformers: [],
        };

      default:
        return fallbackData;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return fallbackData; // Fallback to hardcoded data on error
  }
}