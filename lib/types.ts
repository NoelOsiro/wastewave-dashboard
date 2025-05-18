// lib/types.ts
export type Payment = {
  id: string; // Changed from number to string
  transaction_id: string; // Maps to mpesaTransactionId
  amount: number; // Changed from string to number (float in schema)
  method: string; // Derived from phoneNumber or static "M-Pesa"
  status: string; // e.g., "Completed", "Pending", "Failed"
  date: string; // ISO date string from transactionDate
  house_id: string; // Maps to collectionRequest.generatorId
  house: string; // Derived from collectionRequest.generator.address
  owner: string; // Derived from payer.name or email
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
export type HouseStatus = "Active" | "Inactive" | "Pending" | string;

export type HouseData = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  owner: string;
  contact: string;
  email: string;
  status: HouseStatus;  // Now it's explicitly typed
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


export type Profiletype = {
  id: string; // Profile.id
  userId: string; // Profile.userId
  email: string; // User.email
  name: string; // User.name
  phone: string; // User.phone (we’ll add to schema)
  role: string; // Profile.role
  onboardingStep: string; // Profile.onboardingStep
  onboardingCompleted: boolean; // Profile.onboardingCompleted
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
  id: string;
  title: string | null;
  createdAt: string; // ISO format: "YYYY-MM-DD"
  requestedTime: string; // e.g., "9:00 AM - 11:00 AM"
  location: string | null;
  generatorId: string;
  status: string;
  collector: { id: string; userId: string; vehicle: string; capacity: number; } | null;
  updatedAt: string;
  wasteType: string;
  amount: number;
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
// lib/types.ts
export type Template = {
  id: string;
  title: string;
  description: string;
  type: string;
  last_sent: string; // ISO string or empty
};

export type IHistory = {
  id: string;
  title: string;
  recipients: string;
  type: string;
  date: string; // YYYY-MM-DD
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
  status: string;
  date: string;
}

export interface Collection {
  id: number;
  house: string;
  date: string;
  status: string;
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

export interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: string | number }>;
      };
    };
  };
}

export interface MpesaMetadata {
  MpesaReceiptNumber?: string;
  TransactionDate?: string;
  PhoneNumber?: string;
  Amount?: number;
  [key: string]: string | number | undefined;
}

export type SerializedUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  imageUrl: string | null;
};