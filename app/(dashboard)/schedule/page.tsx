import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";




import { fetchCollectionEvents } from "@/lib/supabase";
import { recentCollectionsData } from "@/lib/types";
import { Calendar } from "@/components/schedule/Calendar";
import { UpcomingCollections } from "@/components/schedule/UpcomingCollections";
import { RecentCollections } from "@/components/schedule/RecentCollections";

export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function SchedulePage() {
  const collectionEvents = await fetchCollectionEvents();

  const userData = {
    name: "Waste Admin",
    email: "admin@wastewave.com",
    role: "house",
    image: "https://images.unsplash.com/photo-1502685104226-e9b3c4f2e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  }

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-semibold tracking-tight">Collection Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Manage garbage collection schedules and track their status.
            </p>
          </div>
          { userData.role === "admin" && (
            <Button>
            <Plus size={16} className="mr-2" />
            Schedule Collection
          </Button>
          )}
          
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
  );
}