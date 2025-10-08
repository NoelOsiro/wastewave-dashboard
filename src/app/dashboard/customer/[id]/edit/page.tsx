import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { supabase } from 'src/lib/supabase';

import { CustomerEditView } from 'src/sections/customer/view';

export const metadata: Metadata = { title: `Customer edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;
  let currentCustomer = null;
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  if (!error && data) {
    currentCustomer = data;
  }
  return <CustomerEditView customer={currentCustomer} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const { data, error } = await supabase
      .from('customers')
      .select('id');
    if (error || !data) return [];
    return data.map((customer) => ({ id: customer.id }));
  }
  return [];
}
