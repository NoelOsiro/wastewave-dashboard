import { z } from "zod";

export type HouseData = {
  id: number;
  name: string;
  owner: string;
  contact: string;
  email: string;
  location: string;
  status: "Active" | "Inactive";
  last_collection: string;
  payment_status: string;
};

export type HouseFormValues = {
  name: string;
  owner: string;
  contact: string;
  email: string;
  location: string;
  status: "Active" | "Inactive";
};

export const houseSchema = z.object({
  name: z.string().min(1, "House name is required").max(100, "House name must be less than 100 characters"),
  owner: z.string().min(1, "Owner name is required").max(100, "Owner name must be less than 100 characters"),
  contact: z.string().min(1, "Contact number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  status: z.enum(["Active", "Inactive"]),
});