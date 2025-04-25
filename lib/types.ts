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

  export type HouseData = {
    id: number;
    name: string;
    owner: string;
    contact: string;
    email: string;
    location: string;
    status: "Active" | "Inactive";
    last_collection: string;
    payment_status: string;
  };
  
  export type HouseFormValues = {
    name: string;
    owner: string;
    contact: string;
    email: string;
    location: string;
    status: "Active" | "Inactive";
  };
export interface StepComponentProps<T> {
  formData: T;
  updateFormData: (data: T) => void;
}

interface FormData {
  roleSelection?: RoleSelectionData;
  licenseVerification?: LicenseVerificationData;
  vehicleCompliance?: VehicleComplianceData;
}
export interface Step<T = any> {
  id: string;
  title: string;
  description: string;
  component: (props: StepComponentProps<T>) => React.ReactNode;
  isOptional?: boolean;
  validate?: (formData: FormData) => boolean;
  shouldShow?: (role: string | null) => boolean;
}

export interface RoleSelectionData {
  role: string | null;
}

export interface LicenseVerificationData {
  file: File | null;
  licenseNumber: string;
  issuingDate: string | undefined;
  expiryDate: string | undefined;
  licenseType: string;
}


export interface VehicleComplianceData {
  vehicleReg: string;
  vehicleType: string;
  vehicleCapacity: string;
  labelPhoto: File | null;
  sealingPhoto: File | null;
  routes: string;
}


  export type Profile = {
    id: string;
    name: string;
    email: string;
    onboarding_step: string;
    onboarding_completed: boolean;
    phone: string;
    
  }
  
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
    collector:string;
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
// types/dashboard.ts
export enum UserRole {
  Admin = "admin",
  House = "house",
  Collector = "collector",
  Manager = "manager",
  Transporter = "transporter",
  Generator = "generator",
  Disposer = "disposer",
  Recycler = "recycler",
}

export interface RevenueData {
  [key: string]: string | number;
  name: string;
  revenue: number;
}

export interface WasteCollectionData {
  [key: string]: string | number;
  name: string;
  value: number;
}

export interface ScheduleData {
  [key: string]: string | number;
  name: string;
  completed: number;
  pending: number;
}

export interface PaymentDash {
  id: number;
  house: string;
  amount: string;
  method: string;
  status: "Paid" | "Pending";
  date: string;
}

export interface Collection {
  id: number;
  house: string;
  date: string;
  status: "Scheduled" | "Completed" | "Pending";
}

export interface Performer {
  id: number;
  house: string;
  points: number;
  wasteSeparation: string;
}

export interface DashboardData {
  revenueData: RevenueData[];
  wasteCollectionData: WasteCollectionData[];
  scheduleData: ScheduleData[];
  recentPayments: PaymentDash[];
  upcomingCollections: Collection[];
  topPerformers: Performer[];
}