"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Action to send a new notification
export async function sendNotification(formData: FormData) {
  const supabase = await createClient();

  const notification = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    recipients: formData.get("recipients") as string,
    message: formData.get("message") as string,
    status: "Pending",
    delivery_rate: "0%",
    date: new Date().toISOString(),
  };

  const { error } = await supabase.from("notifications").insert([notification]);

  if (error) {
    redirect(`/notifications?error=${encodeURIComponent("Failed to send notification")}`);
  }

  redirect("/notifications?tab=history");
}

// Action to create a new template
export async function createTemplate(formData: FormData) {
  const supabase = await createClient();

  const template = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    last_sent: null,
  };

  const { error } = await supabase.from("notification_templates").insert([template]);

  if (error) {
    redirect(`/notifications?error=${encodeURIComponent("Failed to create template")}`);
  }

  redirect("/notifications?tab=templates");
}