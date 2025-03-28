
import { Layout } from "@/components/layout/Layout";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EditHouseForm } from "./EditHouseForm";

export const dynamic = "force-dynamic"; // Force SSR on every request

export default async function EditHousePage({
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div>
          <h1 className="font-semibold tracking-tight text-2xl">Edit House</h1>
          <p className="text-muted-foreground mt-1">
            Update the details for {house.name}
          </p>
        </div>
        <EditHouseForm house={house} />
      </div>
    </Layout>
  );
}
