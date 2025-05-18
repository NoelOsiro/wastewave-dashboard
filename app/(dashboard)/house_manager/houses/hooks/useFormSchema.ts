import { z } from "zod";

export const houseSchema = z.object({
  name: z.string().min(1, "House name is required").max(100, "House name is too long"),
  owner: z.string().min(1, "Owner name is required").max(100, "Owner name is too long"),
  contact: z.string().min(1, "Contact is required").max(50, "Contact is too long"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  location: z.string().min(1, "Location is required").max(200, "Location is too long"),
  status: z.string(),
});