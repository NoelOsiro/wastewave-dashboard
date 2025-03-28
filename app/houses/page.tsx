import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metrics } from "./components/Metrics";
import ClientComponents from "@/app/houses/clientcomponents";
import { HouseData } from "./hooks/useFormSchema";
import { Suspense } from "react";
import { fetchHouses } from "@/lib/supabase";
import Link from "next/link";


// Mark as dynamic to force SSR on every request (optional)
export const dynamic = "force-dynamic";

export default async function HousesPage() {
  const houses = await fetchHouses();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-semibold tracking-tight">Houses Management</h1>
            <p className="text-muted-foreground mt-1">Manage all registered houses and their details.</p>
          </div>
          <Button asChild>
            <Link href="/houses/add">
              <Plus size={16} className="mr-2" />
              Add New House
            </Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading metrics...</div>}>
          <Metrics />
        </Suspense>
        <ClientComponents initialHouses={houses} />
      </div>
    </Layout>
  );
}

