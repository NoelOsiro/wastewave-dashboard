"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addHouse } from "./actions"; // Import the server action

interface AddHouseFormProps {
  error?: string;
}

export default function AddHouseForm({ error: initialError }: AddHouseFormProps) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(initialError);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        setFormError(undefined);
        await addHouse(formData); // Call the server action (redirects on success)
        setLoading(false); // This won't run due to redirect, but included for completeness
      }}
      className="space-y-6"
    >
      {formError && <p className="text-red-500">{formError}</p>}
      <div className="space-y-2">
        <Label htmlFor="name">House Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Garcia Residence"
          className="glass-input"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          name="owner"
          placeholder="e.g. John Doe"
          className="glass-input"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Contact</Label>
        <Input
          id="contact"
          name="contact"
          placeholder="e.g. +1234567890"
          className="glass-input"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="e.g. john@example.com"
          className="glass-input"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g. 123 Main St"
          className="glass-input"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="glass-input w-full p-2 rounded-md"
          defaultValue="Active"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" disabled={loading}>
          <a href="/houses">Cancel</a>
        </Button>
        <Button type="submit" className="glass-button" disabled={loading}>
          {loading ? "Saving..." : "Add House"}
        </Button>
      </div>
    </form>
  );
}