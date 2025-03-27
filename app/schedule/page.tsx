import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";


import { Calendar } from "./componenents/Calendar";
import { UpcomingCollections } from "./componenents/UpcomingCollections";
import { RecentCollections } from "./componenents/RecentCollections";

import { fetchCollectionEvents } from "@/lib/supabase";
import { recentCollectionsData } from "@/lib/types";

export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function SchedulePage() {
  const collectionEvents = await fetchCollectionEvents();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-semibold tracking-tight">Collection Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Manage garbage collection schedules and track their status.
            </p>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Schedule Collection
          </Button>
        </div>
        <Suspense fallback={<div>Loading calendar...</div>}>
          <Calendar initialEvents={collectionEvents} />
        </Suspense>
        <Suspense fallback={<div>Loading upcoming collections...</div>}>
          <UpcomingCollections events={collectionEvents} />
        </Suspense>
        <Suspense fallback={<div>Loading recent collections...</div>}>
          <RecentCollections collections={recentCollectionsData} />
        </Suspense>
      </div>
    </Layout>
  );
}