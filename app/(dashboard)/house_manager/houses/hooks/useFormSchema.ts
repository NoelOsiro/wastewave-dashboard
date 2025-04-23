import { z } from "zod";



export const houseSchema = z.object({
  name: z.string().min(1, "House name is required").max(100, "House name must be less than 100 characters"),
  owner: z.string().min(1, "Owner name is required").max(100, "Owner name must be less than 100 characters"),
  contact: z.string().min(1, "Contact number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  status: z.enum(["Active", "Inactive"]),
});