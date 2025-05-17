"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { IHistory, Template } from "@/lib/types";

export async function fetchNotificationTemplates(): Promise<Template[]> {
  try {
    const templates = await prisma.notificationTemplate.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        lastSent: true,
      },
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title || "Untitled",
      description: template.description || "",
      type: template.type || "unknown",
      last_sent: template.lastSent ? template.lastSent.toISOString() : "",
    }));
  } catch (error) {
    console.error("Error fetching notification templates:", error);
    return [];
  }
}

export async function createTemplate(formData: FormData) {
  try {
    await prisma.notificationTemplate.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        lastSent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return redirect(`/notifications?tab=templates&created=true`);
  } catch (error) {
    console.error("Error creating notification template:", error);
    return redirect(`/notifications?error=${encodeURIComponent("Failed to create template")}`);
  }
}

export async function fetchNotificationHistory(): Promise<IHistory[]> {
  try {
    const notifications = await prisma.notification.findMany({
      select: {
        id: true,
        title: true,
        recipients: true,
        type: true,
        date: true,
        status: true,
        deliveryRate: true,
      },
    });

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title || "Untitled",
      recipients: notification.recipients || "N/A",
      type: notification.type || "unknown",
      date: notification.date.toISOString().split("T")[0] || "",
      status: notification.status || "unknown",
      delivery_rate: notification.deliveryRate || "0%",
    }));
  } catch (error) {
    console.error("Error fetching notification history:", error);
    return [];
  }
}

export async function fetchNotificationMetrics() {
  try {
    const notifications = await prisma.notification.findMany({
      select: {
        channel: true,
      },
    });

    const total = notifications.length;
    const sms_sent = notifications.filter((n) => n.channel === "sms").length;
    const email_sent = notifications.filter((n) => n.channel === "email").length;
    const delivery_rate = total > 0 ? `${Math.round(((sms_sent + email_sent) / total) * 100)}%` : "0%";

    return {
      total_sent: total,
      sms_sent,
      email_sent,
      delivery_rate,
    };
  } catch (error) {
    console.error("Error fetching notification metrics:", error);
    return {
      total_sent: 0,
      sms_sent: 0,
      email_sent: 0,
      delivery_rate: "0%",
    };
  }
}

export async function sendNotification(formData: FormData) {
  try {
    await prisma.notification.create({
      data: {
        title: formData.get("title") as string,
        recipients: formData.get("recipients") as string,
        type: formData.get("type") as string,
        channel: formData.get("channel") as string,
        date: new Date(),
        status: "Pending",
        deliveryRate: "0%",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return redirect("/notifications?tab=history");
  } catch (error) {
    console.error("Error sending notification:", error);
    return redirect(`/notifications?error=${encodeURIComponent("Failed to send notification")}`);
  }
}

export async function fetchNotificationData() {
  try {
    const [templates, history, metrics] = await Promise.all([
      fetchNotificationTemplates(),
      fetchNotificationHistory(),
      fetchNotificationMetrics(),
    ]);

    return { templates, history, metrics };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      templates: [],
      history: [],
      metrics: { total_sent: 0, sms_sent: 0, email_sent: 0, delivery_rate: "0%" },
    };
  }
}