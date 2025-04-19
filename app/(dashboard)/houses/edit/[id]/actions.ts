
"use server";

import { createClient } from "@/utils/supabase/server";
import { houseSchema, HouseFormValues } from "../../hooks/useFormSchema";
import { redirect } from "next/navigation";

export async function updateHouse(houseId: number, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name") as string,
    owner: formData.get("owner") as string,
    contact: formData.get("contact") as string,
    email: formData.get("email") as string,
    location: formData.get("location") as string,
    status: formData.get("status") as string,
  };

  const result = houseSchema.safeParse(rawData);
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || "Validation failed";
    throw new Error(errorMessage);
  }

  const { data, error } = await supabase
    .from("houses")
    .update(result.data)
    .eq("id", houseId)
    .select();

  if (error) {
    throw new Error("Failed to update house: " + error.message);
  }

  return data;
}
