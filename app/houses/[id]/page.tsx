
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { HouseDetailsCard } from "../components/HouseDetailsCard";
import { CollectionHistoryCard } from "../components/CollectionHistoryCard";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function HouseViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();
  
  // Fetch house data
  const { data: house, error } = await supabase
    .from("houses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !house) {
    notFound();
  }

  // Fetch collection history
  const { data: collectionHistory, error: historyError } = await supabase
    .from("collections")
    .select("*")
    .eq("house", id)
    .order("collection_date", { ascending: false });

  if (historyError) {
    console.error("Error fetching collection history:", historyError);
  }

  return (
    <Layout>
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
              collectionHistory={collectionHistory || []} 
              houseId={id} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
