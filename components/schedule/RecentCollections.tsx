import { DashboardCard } from "@/components/dashboard/DashboardCard";

type RecentCollection = {
  id: number;
  area: string;
  date: string;
  housesCompleted: number;
  housesTotal: number;
  collector: string;
  status: string;
};

type RecentCollectionsProps = {
  collections: RecentCollection[];
};

export const RecentCollections = ({ collections }: RecentCollectionsProps) => {
  return (
    <DashboardCard title="Recent Collections">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Collection Area</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Houses</th>
              <th className="text-left py-3 px-4 font-medium">Collector</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => {
              const completionPercentage = ((collection.housesCompleted / collection.housesTotal) * 100).toFixed(0);
              return (
                <tr key={collection.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{collection.area}</td>
                  <td className="py-3 px-4">{collection.date}</td>
                  <td className="py-3 px-4">{`${collection.housesCompleted}/${collection.housesTotal}`}</td>
                  <td className="py-3 px-4">{collection.collector}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`status-badge ${
                        collection.status === "Completed"
                          ? "status-badge-success"
                          : "status-badge-warning"
                      }`}
                    >
                      {collection.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          collection.status === "Completed"
                            ? "bg-status-success"
                            : "bg-status-warning"
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};