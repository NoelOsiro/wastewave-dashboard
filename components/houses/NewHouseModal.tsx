"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { House } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { HouseFormValues } from "@/lib/types";
import { houseSchema } from "@/app/(dashboard)/house_manager/houses/hooks/useFormSchema";

type NewHouseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export const NewHouseModal = ({ open, onOpenChange, onSuccess }: NewHouseModalProps) => {
  const form = useForm<HouseFormValues>({
    resolver: zodResolver(houseSchema),
    defaultValues: { name: "", owner: "", contact: "", email: "", location: "", status: "Active" },
    mode: "onChange",
  });

  const onSubmit = async (data: HouseFormValues) => {
    const supabase = createClient();
    const { data: insertedData, error } = await supabase.from("houses").insert([data]).select();
    if (error) return toast.error("Failed to add new house");
    if (insertedData) {
      toast.success(`${insertedData[0].name} has been added successfully`);
      onSuccess();
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <House size={18} /> Add New House
          </DialogTitle>
          <DialogDescription>Enter the details for the new house.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>House Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Garcia Residence" {...field} className={fieldState.error ? "border-red-500" : ""} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )} />
            {/* Other fields: owner, contact, email, location, status */}
            <DialogFooter>
              <Button type="submit">Add House</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};