import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import ClientComponents from "./clientcomponents";
import { Metrics } from "@/components/houses/Metrics";
import { getHousesData } from "@/utils/houses";


// Mark as dynamic to force SSR on every request (optional)
export const dynamic = "force-dynamic";

export default async function HousesPage() {
  const houses = await getHousesData();

  return (
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
  );
}

