"use client";

import { useState, useEffect } from "react";

import { HouseData } from "../hooks/useFormSchema";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";

type ViewHouseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  house: HouseData | null;
  onEdit: (house: HouseData) => void;
};

export const ViewHouseSheet = ({ open, onOpenChange, house, onEdit }: ViewHouseSheetProps) => {
  const [collectionHistory, setCollectionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (house && open) {
      const fetchCollectionHistory = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("collections")
          .select()
          .eq("house", house.id)
          .order("collection_date", { ascending: false });
        if (error) {
          toast.error("Failed to fetch collection history");
        } else {
          setCollectionHistory(data || []);
        }
      };
      fetchCollectionHistory();
    }
  }, [house, open]);

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
              <Button
                variant="outline"
                onClick={() => onEdit(house)}
                className="w-full"
              >
                <Edit size={16} className="mr-2" />
                Edit House
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection Date</TableHead>
                    <TableHead>Sorted</TableHead>
                    <TableHead>Collector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionHistory.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>{collection.collection_date}</TableCell>
                      <TableCell>Sorted</TableCell> {/* Placeholder; adjust based on schema */}
                      <TableCell>John Doe</TableCell> {/* Placeholder */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};