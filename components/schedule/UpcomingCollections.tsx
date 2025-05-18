import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { CollectionEvent } from "@/lib/types";
import { Calendar, Clock, MapPin, Check, X, AlertCircle } from "lucide-react";


type UpcomingCollectionsProps = {
  events: CollectionEvent[];
};

export const UpcomingCollections = ({ events }: UpcomingCollectionsProps) => {
  return (
    <DashboardCard className="lg:col-span-2" title="Upcoming Collections">
      <div className="space-y-6 mt-2">
        {events.slice(0, 4).map((event) => (
          <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                  <span className="mx-1">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>{event.requestedTime}</span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>{event.location}</span>
                  <span className="mx-1">•</span>
                  <span>24 houses</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.status === "Completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                    : event.status === "In Progress"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                    : event.status === "Scheduled"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                }`}
              >
                {event.status}
              </span>
            </div>
            {event.status === "In Progress" && (
              <div className="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                  size="sm"
                >
                  <Check size={12} className="mr-1" />
                  Complete
                </Button>
                <Button variant="destructive" size="sm">
                  <X size={12} className="mr-1" />
                  Cancel
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle size={12} className="mr-1" />
                  Issue
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" className="w-full">
          View All Schedules
        </Button>
      </div>
    </DashboardCard>
  );
};