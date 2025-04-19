
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CalendarClock, Plus } from "lucide-react";
import { NewCollectionDialog } from "./NewCollectionDialog";

interface CollectionHistoryCardProps {
  collectionHistory: any[];
  houseId: string;
}

export function CollectionHistoryCard({ 
  collectionHistory, 
  houseId 
}: CollectionHistoryCardProps) {
  const [openNewCollection, setOpenNewCollection] = useState(false);

  return (
    <>
      <Card className="glass-card h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <CalendarClock size={20} className="text-primary" />
              Collection History
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpenNewCollection(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {collectionHistory.length > 0 ? (
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Collector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionHistory.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        {new Date(collection.collection_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            collection.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : collection.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {collection.status || "Completed"}
                        </span>
                      </TableCell>
                      <TableCell>{collection.collector || "System"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No collection history available</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setOpenNewCollection(true)}
                className="mt-4"
              >
                <Plus size={16} className="mr-2" />
                Schedule Collection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <NewCollectionDialog 
        open={openNewCollection} 
        onOpenChange={setOpenNewCollection}
        houseId={houseId}
      />
    </>
  );
}
