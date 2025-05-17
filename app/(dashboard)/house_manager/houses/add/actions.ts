"use server"; // Mark the entire file as a server module

import { createHouse } from "@/utils/houses";
import { houseSchema} from "../hooks/useFormSchema";
import { redirect } from "next/navigation";

export async function addHouse(formData: FormData) {

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
    redirect(`/houses/add?error=${encodeURIComponent(errorMessage)}`);
  }

  const error = await createHouse(result.data);

  if (error) {
    redirect(`/houses/add?error=${encodeURIComponent("Failed to add house")}`);
  }

  redirect("/houses");
}