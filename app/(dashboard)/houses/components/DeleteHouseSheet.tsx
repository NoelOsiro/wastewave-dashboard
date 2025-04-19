"use client";

import { HouseData } from "../hooks/useFormSchema";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type DeleteHouseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  house: HouseData | null;
  onSuccess: () => void;
};

export const DeleteHouseSheet = ({ open, onOpenChange, house, onSuccess }: DeleteHouseSheetProps) => {
  const onDelete = async () => {
    if (!house) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("houses")
      .delete()
      .eq("id", house.id); // Use id for uniqueness
    if (error) {
      return toast.error("Failed to delete house");
    }
    toast.success(`${house.name} has been deleted successfully`);
    onSuccess(); // Trigger refetch or revalidation in parent
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Eye size={18} />
            House Details
          </SheetTitle>
        </SheetHeader>
        {house && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">House Name</h3>
                <p className="mt-1">{house.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Owner</h3>
                <p className="mt-1">{house.owner}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                  <p className="mt-1">{house.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1">{house.email}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="mt-1">{house.location}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${house.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                  >
                    {house.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment</h3>
                  <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${house.payment_status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : house.payment_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {house.payment_status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Collection</h3>
                  <p className="mt-1">{house.last_collection}</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <Button variant="destructive" onClick={onDelete} className="w-full">
                <Trash2 size={16} className="mr-2" />
                Delete House
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};