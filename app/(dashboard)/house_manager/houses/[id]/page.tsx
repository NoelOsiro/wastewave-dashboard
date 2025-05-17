
import { notFound } from "next/navigation";
import { HouseDetailsCard } from "@/components/houses/HouseDetailsCard";
import { CollectionHistoryCard } from "@/components/houses/CollectionHistoryCard";
import { getHouseById } from "@/utils/houses";
import { getHouseCollection } from "@/utils/collectionEvents";

export const dynamic = "force-dynamic"; // Force SSR on every request
// Define the props type explicitly
interface HousePageProps {
  params: Promise<{ id: string }>; // params is a Promise
}
export default async function HouseViewPage({ params }: HousePageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Fetch house data
  const house = await getHouseById(id);
  if (!house) {notFound();}

  // Fetch collection history
  const collectionHistory = await getHouseCollection(id);

  if (!collectionHistory || collectionHistory.length == 0) {
    console.error("Error fetching collection history:");
  }

  return (
      <div className="space-y-8">
        <div>
          <h1 className="font-semibold tracking-tight">{house.name}</h1>
          <p className="text-muted-foreground mt-1">
            View all details for this house
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HouseDetailsCard house={house} />
          </div>
          <div className="lg:col-span-1">
            <CollectionHistoryCard 
              collectionHistory={collectionHistory} 
              houseId={id} 
            />
          </div>
        </div>
      </div>
  );
}
