
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  houseSchema } from "../../hooks/useFormSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateHouse } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Home, User, Mail, Phone, MapPin } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { HouseData, HouseFormValues } from "@/lib/types";

type EditHouseFormProps = {
  house: HouseData;
};

export function EditHouseForm({ house }: EditHouseFormProps) {
  const router = useRouter();
  const form = useForm<HouseFormValues>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      name: house.name,
      owner: house.owner,
      contact: house.contact,
      email: house.email,
      location: house.location,
      status: house.status as "Active" | "Inactive",
    },
    mode: "onChange",
  });

  async function handleSubmit(data: FormData) {
    try {
      await updateHouse(house.id, data);
      toast.success("House updated successfully");
      router.push(`/houses/${house.id}`);
    } catch (error) {
      toast.error("Failed to update house");
      console.error(error);
    }
  }

  return (
    <>
      <Card className="glass-card">
        <CardContent className="p-6">
          <Form {...form}>
            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Home size={16} className="text-primary" />
                        House Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} name="name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        Owner Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} name="owner" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input {...field} name="email" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone size={16} className="text-primary" />
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input {...field} name="contact" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} name="location" />
                      </FormControl>
                      <FormMessage />
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
                          className="w-full rounded-md border border-input bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                          name="status"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Cancel
                </Button>
                <SubmitButton className="flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </SubmitButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
