
"use server";

import { houseSchema } from "../../hooks/useFormSchema";
import { updatedHouse } from "@/utils/houses";

export async function updateHouse(houseId: string, formData: FormData) {

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

  const {error} = await updatedHouse(houseId, result.data)

  if (error) {
    throw new Error("Failed to update house: " + error);
  }

}
