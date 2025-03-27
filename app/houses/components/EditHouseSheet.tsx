"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HouseData, HouseFormValues, houseSchema } from "../hooks/useFormSchema";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type EditHouseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  house: HouseData | null;
  onSuccess: () => void;
};

export const EditHouseSheet = ({ open, onOpenChange, house, onSuccess }: EditHouseSheetProps) => {
  const form = useForm<HouseFormValues>({
    resolver: zodResolver(houseSchema),
    defaultValues: house || {
      name: "",
      owner: "",
      contact: "",
      email: "",
      location: "",
      status: "Active",
    },
    mode: "onChange",
  });

  // Reset form when house changes (e.g., when a new house is selected)
  if (house && form.getValues("name") !== house.name) {
    form.reset({
      name: house.name,
      owner: house.owner,
      contact: house.contact,
      email: house.email,
      location: house.location,
      status: house.status as "Active" | "Inactive",
    });
  }

  const onSubmit = async (data: HouseFormValues) => {
    const supabase = createClient();
    const { data: updatedData, error } = await supabase
      .from("houses")
      .update(data)
      .eq("id", house?.id) // Use id instead of name for uniqueness
      .select();
    if (error) {
      return toast.error("Failed to update house");
    }
    if (updatedData) {
      toast.success(`${updatedData[0].name} has been updated successfully`);
      onSuccess(); // Trigger refetch or revalidation in parent
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Edit size={18} />
            Edit House
          </SheetTitle>
          <SheetDescription>Update the details for {house?.name}.</SheetDescription>
        </SheetHeader>
        {house && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>House Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={fieldState.error ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={fieldState.error ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-input p-2 text-sm"
                        {...field}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button type="submit">Save Changes</Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};