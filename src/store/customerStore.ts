import type { ICustomerItem } from 'src/types/customer';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { supabase } from 'src/lib/supabase';

type CustomerState = {
  customers: ICustomerItem[];
  loading: boolean;
  error: Error | null;
  setCustomers: (customers: ICustomerItem[]) => void;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Partial<ICustomerItem>) => Promise<void>;
  editCustomer: (customer: ICustomerItem) => Promise<void>;
  deleteCustomer: (customer: ICustomerItem) => Promise<void>;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],
      loading: false,
      error: null,
      setCustomers: (customers) => set({ customers }),
      fetchCustomers: async () => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('customers')
            .select('*');
          if (error) throw error;
          set({ customers: data || [], loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to fetch customers');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },
  addCustomer: async (customer) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select();
          if (error) throw error;
          set((state) => ({
            customers: data ? [...state.customers, ...data] : state.customers,
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to create customer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },

      editCustomer: async (customer) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from('customers')
            .update(customer)
            .eq('id', customer.id)
            .select();
          if (error) throw error;
          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === customer.id ? { ...c, ...customer } : c
            ),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to update customer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      },

      deleteCustomer: async (customer) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', customer.id);
          if (error) throw error;
          set((state) => ({
            customers: state.customers.filter((c) => c.id !== customer.id),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error : new Error('Failed to delete customer');
          set({ error: errorMessage, loading: false });
          throw errorMessage;
        }
      }

    }),
    {
      name: 'customer-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Change to sessionStorage if needed
    }
  )
);
