import AddHouseForm from "./AddHouseForm";


interface AddHousePageProps {
  
  searchParams: Promise<{ error?: string }>;
}
export default async function AddHousePage({searchParams}: AddHousePageProps) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error;

  return (
      <div className="max-w-md mx-auto space-y-8 py-8">
        <div>
          <h1 className="font-semibold tracking-tight text-2xl">Add New House</h1>
          <p className="text-muted-foreground mt-1">Enter the details for the new house.</p>
        </div>
        <AddHouseForm error={error} />
      </div>
  );
}