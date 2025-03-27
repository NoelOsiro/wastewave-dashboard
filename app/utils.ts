import { createClient } from "@/utils/supabase/server";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to fetch houses (server-side)
export const fetchHouses = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("houses").select("*");
  if (error) throw new Error(error.message);
  return data || [];
};

export const fetchPayments = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      payment_method,
      transaction_id,
      status,
      payment_date,
      house_id,
      houses (
        name,
        owner
      )
    `);
  if (error) throw new Error(error.message);

  return data.map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    transaction_id: payment.transaction_id,
    method: payment.payment_method,
    status: payment.status,
    date: payment.payment_date,
    house_id: payment.house_id,
    house: payment.houses?.name || "Unknown",
    owner: payment.houses?.owner || "Unknown",
  }));
};

export const fetchPaymentStatusBreakdown = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_payment_status_breakdown");
  if (error) throw new Error(error.message);

  return data.map((item: { status: string; count: number; total_amount: string }) => ({
    name: item.status,
    value: item.count,
    totalAmount: item.total_amount,
  }));
};

export const fetchPaymentsBreakdown = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_payment_method_breakdown");
  if (error) throw new Error(error.message);

  return data.map((item: { payment_method: string; count: number; total_amount: string }) => ({
    name: item.payment_method,
    value: item.count,
    totalAmount: item.total_amount,
  }));
};

export const fetchCollectionEvents = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('collection_events').select('*');
  if (error) throw new Error(error.message);

  return data.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    houses: event.houses,
    status: event.status,
  }));
};