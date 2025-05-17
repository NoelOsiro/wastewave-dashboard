
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createCollectionEvent } from "@/utils/collectionEvents";

interface NewCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string;
}

export function NewCollectionDialog({
  open,
  onOpenChange,
  houseId,
}: NewCollectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, data, error } = await createCollectionEvent({
        generatorId: houseId,
        status: "Scheduled",
        wasteType: "",
        amount: 0,
        title: collectionDate,
        location: "",
      });
      
      if (error) throw error;
      
      toast.success("Collection scheduled successfully");
      onOpenChange(false);
      
      // Optionally refresh the page to show the new collection
      window.location.reload();
    } catch (error) {
      toast.error("Failed to schedule collection");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock size={20} className="text-primary" />
            Schedule New Collection
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collection-date" className="text-right">
                Date
              </Label>
              <Input
                id="collection-date"
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
