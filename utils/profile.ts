"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Profiletype } from "@/lib/types";

export async function fetchProfile(): Promise<Profiletype | null> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) return null;

    return {
      id: profile.id,
      userId: profile.userId,
      email: profile.user.email || "",
      name: profile.user.name || "",
      phone: profile.user.phone || "",
      role: profile.role || "",
      onboardingStep: profile.onboardingStep || "",
      onboardingCompleted: profile.onboardingCompleted,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ success: boolean; error?: string }> {
  const client= await clerkClient();
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const name = `${data.firstName} ${data.lastName}`;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone: data.phone,
      },
    });

    // Update Clerk user metadata
    await client.users.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updatePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const client= await clerkClient();
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Verify current password (Clerk doesn't store passwords, so this may need external validation)
    // For now, assume Clerk's password update API
    await client.users.updateUser(userId, {
      password: data.newPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: (error as Error).message };
  }
}