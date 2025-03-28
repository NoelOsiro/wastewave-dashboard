import { Layout } from "@/components/layout/Layout";
import AddHouseForm from "./AddHouseForm";

export default async function AddHousePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-8 py-8">
        <div>
          <h1 className="font-semibold tracking-tight text-2xl">Add New House</h1>
          <p className="text-muted-foreground mt-1">Enter the details for the new house.</p>
        </div>
        <AddHouseForm error={error} />
      </div>
    </Layout>
  );
}