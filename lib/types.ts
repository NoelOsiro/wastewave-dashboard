export type Payment = {
    id: number;
    transaction_id: string;
    amount: string;
    method: string;
    status: string;
    date: string;
    house_id: number;
    house: string;
    owner: string;
  };
  
  export type BreakdownItem = {
    name: string;
    value: number;
    totalAmount: string;
  };
  
  export type StatusBreakdownItem = {
    name: string;
    value: number;
    totalAmount: string;
  };
  
  export const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
  ];

  export type CollectionEvent = {
    id: number;
    title: string;
    date: string; // ISO format: "YYYY-MM-DD"
    time: string; // e.g., "9:00 AM - 11:00 AM"
    location: string;
    houses: number;
    status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  };
  
  export const parseTimeRange = (date: string, time: string) => {
    const [startTime, endTime] = time.split(" - ");
    const [startHour, startMinute] = startTime.replace(/[^\d:]/g, "").split(":");
    const [endHour, endMinute] = endTime.replace(/[^\d:]/g, "").split(":");
  
    const start = new Date(date);
    start.setHours(parseInt(startHour), parseInt(startMinute));
  
    const end = new Date(date);
    end.setHours(parseInt(endHour), parseInt(endMinute));
  
    return { start, end };
  };
  
  // Static data for RecentCollections (replace with Supabase query if needed)
  export const recentCollectionsData = [
    {
      id: 1,
      area: "Green Valley Estate",
      date: "2023-02-24",
      housesCompleted: 18,
      housesTotal: 18,
      collector: "John Doe",
      status: "Completed",
    },
    {
      id: 2,
      area: "Sunset Apartments",
      date: "2023-02-23",
      housesCompleted: 42,
      housesTotal: 42,
      collector: "Jane Smith",
      status: "Completed",
    },
    {
      id: 3,
      area: "Riverside Heights",
      date: "2023-02-22",
      housesCompleted: 24,
      housesTotal: 26,
      collector: "Michael Johnson",
      status: "Completed",
    },
    {
      id: 4,
      area: "Mountain View Homes",
      date: "2023-02-21",
      housesCompleted: 12,
      housesTotal: 15,
      collector: "Sarah Williams",
      status: "In Progress",
    },
    {
      id: 5,
      area: "Golden Gate Residences",
      date: "2023-02-20",
      housesCompleted: 28,
      housesTotal: 30,
      collector: "Robert Chen",
      status: "Completed",
    },
  ];

  // Add missing Template type for notifications
  export type Template = {
    id: string;
    title: string;
    description: string;
    type: string;
    last_sent: string | null;
  };

  // Add missing IHistory interface for notification history
  export type IHistory = {
    id: string;
    title: string;
    recipients: string;
    type: string;
    date: string;
    status: string;
    delivery_rate: string;
  };
