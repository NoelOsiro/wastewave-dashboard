import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password cannot exceed 50 characters"),
  // Uncomment the line below if you want to include the role field
  // role: z.enum(["house", "house_manager", "admin"]).default("house"),
});