import { createClient } from "@/utils/supabase/server"

import { redirect } from "next/navigation"

export async function fetchNotificationTemplates(): Promise<Template[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("notification_templates").select("*")

  if (error) {
    console.error("Error fetching notification templates:", error)
    return []
  }

  return data.map((template) => ({
    id: template.id,
    title: template.title || "Untitled",
    description: template.description || "",
    type: template.type || "unknown",
    last_sent: template.last_sent || "",
  }))
}

export async function createTemplate(formData: FormData) {
  try {
    const supabase = await  createClient()

    const { error } = await supabase.from("notification_templates").insert({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      last_sent: null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating notification template:", error)
      return redirect(`/notifications?error=${encodeURIComponent("Failed to create template")}`)
    }

    return redirect(`/notifications?tab=templates&created=true`)
  } catch (error) {
    console.error("Error creating notification template:", error)
    return redirect(`/notifications?error=${encodeURIComponent("Failed to create template")}`)
  }
}

export async function fetchNotificationHistory(): Promise<IHistory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("notifications").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching notification history:", error)
    return []
  }

  return data.map((notification) => ({
    id: notification.id,
    title: notification.title || "Untitled",
    recipients: notification.recipients || "N/A",
    type: notification.type || "unknown",
    date: notification.date?.split("T")[0] || "",
    status: notification.status || "unknown",
    delivery_rate: notification.delivery_rate || "0%",
  }))
}

export async function fetchNotificationMetrics() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("notifications").select("channel")

  if (error) {
    console.error("Error fetching notification metrics:", error)
    return {
      total_sent: 0,
      sms_sent: 0,
      email_sent: 0,
      delivery_rate: "0%",
    }
  }

  const total = data.length
  const sms_sent = data.filter((n) => n.channel === "sms").length
  const email_sent = data.filter((n) => n.channel === "email").length

  const delivery_rate = total > 0 ? `${Math.round(((sms_sent + email_sent) / total) * 100)}%` : "0%"

  return {
    total_sent: total,
    sms_sent,
    email_sent,
    delivery_rate,
  }
}

export async function sendNotification(formData: FormData) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("notifications").insert({
      title: formData.get("title") as string,
      recipients: formData.get("recipients") as string,
      type: formData.get("type") as string,
      channel: formData.get("channel") as string,
      date: new Date().toISOString(),
      status: "Pending",
      delivery_rate: "0%",
    })

    if (error) {
      console.error("Error sending notification:", error)
      return redirect(`/notifications?error=${encodeURIComponent("Failed to send notification")}`)
    }

    return redirect("/notifications?tab=history")
  } catch (error) {
    console.error("Error sending notification:", error)
    redirect(`/notifications?error=${encodeURIComponent("Failed to send notification")}`)
  }
}

export async function fetchNotificationData() {
  try {
    const [templates, history, metrics] = await Promise.all([
      fetchNotificationTemplates(),
      fetchNotificationHistory(),
      fetchNotificationMetrics(),
    ])

    return { templates, history, metrics }
  } catch (err) {
    console.error("Error fetching notifications:", err)
    return {
      templates: [],
      history: [],
      metrics: { total_sent: 0, sms_sent: 0, email_sent: 0, delivery_rate: "0%" },
    }
  }
}
