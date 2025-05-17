// lib/prisma/queries.ts
import { prisma } from "@/lib/prisma";
import { DashboardData, UserRole } from "./types";


// Fallback hardcoded data (same as provided)
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
    { name: "plastic", value: 400 },
    { name: "paper", value: 300 },
    { name: "organic", value: 500 },
    { name: "metal", value: 200 },
    { name: "glass", value: 278 },
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
  try {
    switch (role) {
      case UserRole.Admin:
        // Fetch all data for admin
        const [revenueData, wasteCollectionData, scheduleData, paymentsData, collectionsData, performersData] = await Promise.all([
          // Revenue: Aggregate MpesaTransaction amounts by month (simplified)
          prisma.mpesaTransaction.groupBy({
            by: ['transactionDate'],
            where: { status: 'Completed' },
            _sum: { amount: true },
            orderBy: { transactionDate: 'asc' },
            take: 7,
          }).then(data =>
            data.map(d => ({
              name: new Date(d.transactionDate).toLocaleString('default', { month: 'short' }),
              revenue: d._sum.amount || 0,
            }))
          ),
          // Waste Collections: Aggregate WasteTransaction by wasteType
          prisma.wasteTransaction.groupBy({
            by: ['wasteType'],
            _sum: { amount: true },
            orderBy: {
              _sum: {
                amount: 'desc'  // or 'asc' for ascending order
              }
            },
            take: 5,
          }).then(data =>
            data.map(d => ({
              name: d.wasteType,
              value: d._sum.amount || 0,
            }))
          ),
          // Schedules: Aggregate CollectionRequest by day (simplified)
          prisma.collectionRequest.groupBy({
            by: ['requestedTime'],
            where: { status: { in: ['pending', 'collected'] } },
            _count: { id: true },
            orderBy: { requestedTime: 'asc' },
            take: 7,
          }).then(data =>
            data.map(d => ({
              name: new Date(d.requestedTime).toLocaleString('default', { weekday: 'short' }),
              completed: d._count.id || 0,
              pending: d._count.id || 0,
            }))
          ),
          // Payments: Fetch recent MpesaTransactions
          prisma.mpesaTransaction.findMany({
            where: { status: { in: ['Completed', 'Pending'] } },
            include: { payer: { include: { Generator: true } } },
            orderBy: { transactionDate: 'desc' },
            take: 5,
          }).then(data =>
            data.map((t, index) => ({
              id: index + 1,
              house: t.payer.Generator?.address || 'Unknown',
              amount: `$${t.amount.toFixed(2)}`,
              method: t.phoneNumber.includes('254') ? 'M-Pesa' : 'SasaPay', // Simplified logic
              status: t.status === 'Completed' ? 'Paid' : 'Pending',
              date: new Date(t.transactionDate).toLocaleString('default', { hour: 'numeric', minute: 'numeric' }),
            }))
          ),
          // Collections: Fetch upcoming CollectionRequests
          prisma.collectionRequest.findMany({
            where: { status: 'pending' },
            include: { generator: true },
            orderBy: { requestedTime: 'asc' },
            take: 5,
          }).then(data =>
            data.map((c, index) => ({
              id: index + 1,
              house: c.generator.address,
              date: new Date(c.requestedTime).toLocaleString('default', {
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
              }),
              status: 'Scheduled',
            }))
          ),
          // Performers: Derive from Generator (placeholder, needs schema extension)
          prisma.generator.findMany({
            include: { collectionRequests: true },
            orderBy: { id: 'desc' }, // Placeholder sorting
            take: 5,
          }).then(data =>
            data.map((g, index) => ({
              id: index + 1,
              house: g.address,
              points: g.collectionRequests.length * 100, // Placeholder logic
              wasteSeparation: `${Math.min(90 + g.collectionRequests.length, 98)}%`, // Placeholder
            }))
          ),
        ]);

        return {
          revenueData: revenueData.length ? revenueData : fallbackData.revenueData,
          wasteCollectionData: wasteCollectionData.length ? wasteCollectionData : fallbackData.wasteCollectionData,
          scheduleData: scheduleData.length ? scheduleData : fallbackData.scheduleData,
          recentPayments: paymentsData.length ? paymentsData : fallbackData.recentPayments,
          upcomingCollections: collectionsData.length ? collectionsData : fallbackData.upcomingCollections,
          topPerformers: performersData.length ? performersData : fallbackData.topPerformers,
        };

      case UserRole.House:
      case UserRole.Generator: // Map House to Generator
        // Fetch house-specific data
        const [housePayments, houseCollections] = await Promise.all([
          prisma.mpesaTransaction.findMany({
            where: { payerId: userId, status: { in: ['Completed', 'Pending'] } },
            include: { payer: { include: { Generator: true } } },
            orderBy: { transactionDate: 'desc' },
            take: 5,
          }).then(data =>
            data.map((t, index) => ({
              id: index + 1,
              house: t.payer.Generator?.address || 'Unknown',
              amount: `$${t.amount.toFixed(2)}`,
              method: t.phoneNumber.includes('254') ? 'M-Pesa' : 'SasaPay',
              status: t.status === 'Completed' ? 'Paid' : 'Pending',
              date: new Date(t.transactionDate).toLocaleString('default', { hour: 'numeric', minute: 'numeric' }),
            }))
          ),
          prisma.collectionRequest.findMany({
            where: { generator: { userId } },
            include: { generator: true },
            orderBy: { requestedTime: 'asc' },
            take: 5,
          }).then(data =>
            data.map((c, index) => ({
              id: index + 1,
              house: c.generator.address,
              date: new Date(c.requestedTime).toLocaleString('default', {
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
              }),
              status: 'Scheduled',
            }))
          ),
        ]);

        return {
          revenueData: [],
          wasteCollectionData: fallbackData.wasteCollectionData, // Could fetch user-specific waste data
          scheduleData: fallbackData.scheduleData, // Could fetch user-specific schedules
          recentPayments: housePayments.length ? housePayments : fallbackData.recentPayments,
          upcomingCollections: houseCollections.length ? houseCollections : fallbackData.upcomingCollections,
          topPerformers: [],
        };

      case UserRole.Collector:
        // Fetch collector-specific data
        const collectorCollections = await prisma.collectionRequest.findMany({
          where: { collector: { userId } },
          include: { generator: true },
          orderBy: { requestedTime: 'asc' },
          take: 5,
        }).then(data =>
          data.map((c, index) => ({
            id: index + 1,
            house: c.generator.address,
            date: new Date(c.requestedTime).toLocaleString('default', {
              weekday: 'short',
              hour: 'numeric',
              minute: 'numeric',
            }),
            status: 'Scheduled',
          }))
        );

        return {
          revenueData: [],
          wasteCollectionData: fallbackData.wasteCollectionData,
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: collectorCollections.length ? collectorCollections : fallbackData.upcomingCollections,
          topPerformers: [],
        };

      case UserRole.Manager:
        // Fetch manager-specific data
        const [managerCollections, managerPerformers] = await Promise.all([
          prisma.collectionRequest.findMany({
            where: { collector: { userId } }, // Placeholder: Adjust for manager-specific logic
            include: { generator: true },
            orderBy: { requestedTime: 'asc' },
            take: 5,
          }).then(data =>
            data.map((c, index) => ({
              id: index + 1,
              house: c.generator.address,
              date: new Date(c.requestedTime).toLocaleString('default', {
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
              }),
              status: 'Scheduled',
            }))
          ),
          prisma.generator.findMany({
            include: { collectionRequests: true },
            orderBy: { id: 'desc' }, // Placeholder sorting
            take: 5,
          }).then(data =>
            data.map((g, index) => ({
              id: index + 1,
              house: g.address,
              points: g.collectionRequests.length * 100,
              wasteSeparation: `${Math.min(90 + g.collectionRequests.length, 98)}%`,
            }))
          ),
        ]);

        return {
          revenueData: [],
          wasteCollectionData: [],
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: managerCollections.length ? managerCollections : fallbackData.upcomingCollections,
          topPerformers: managerPerformers.length ? managerPerformers : fallbackData.topPerformers,
        };

      case UserRole.Transporter:
      case UserRole.Disposer:
      case UserRole.Recycler:
        // Fetch role-specific data
        const roleCollections = await prisma.collectionRequest.findMany({
          where: { collector: { userId } }, // Adjust based on role
          include: { generator: true },
          orderBy: { requestedTime: 'asc' },
          take: 5,
        }).then(data =>
          data.map((c, index) => ({
            id: index + 1,
            house: c.generator.address,
            date: new Date(c.requestedTime).toLocaleString('default', {
              weekday: 'short',
              hour: 'numeric',
              minute: 'numeric',
            }),
            status: 'Scheduled',
          }))
        );

        return {
          revenueData: [],
          wasteCollectionData: fallbackData.wasteCollectionData,
          scheduleData: [],
          recentPayments: [],
          upcomingCollections: roleCollections.length ? roleCollections : fallbackData.upcomingCollections,
          topPerformers: [],
        };

      default:
        return fallbackData;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return fallbackData;
  }
}