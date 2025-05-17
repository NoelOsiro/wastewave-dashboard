"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  RoleSelectionData,
  LicenseVerificationData,
  VehicleComplianceData,
} from "@/lib/types";

export async function fetchOnboardingData(): Promise<{
  role: string | null;
  onboardingStep: string | null;
  onboardingCompleted: boolean;
}> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { role: true, onboardingStep: true, onboardingCompleted: true },
    });

    if (!profile) throw new Error("Profile not found");

    return {
      role: profile.role || null,
      onboardingStep: profile.onboardingStep || null,
      onboardingCompleted: profile.onboardingCompleted,
    };
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    throw error;
  }
}

export async function updateRoleSelection(data: RoleSelectionData): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Update Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role: data.role },
    });

    // Update Prisma profile
    await prisma.profile.update({
      where: { userId },
      data: {
        role: data.role,
        onboardingStep: data.role === "generator" ? "complete" : "license-verification",
        onboardingCompleted: data.role === "generator",
      },
    });

    // Create Generator record for generator role
    if (data.role === "generator") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      await prisma.generator.upsert({
        where: { userId },
        update: { address: user.email || "Unknown" }, // Replace with actual address if available
        create: {
          userId,
          address: user.email || "Unknown",
          status: "Active",
        },
      });
    }
  } catch (error) {
    console.error("Error updating role selection:", error);
    throw error;
  }
}

export async function createLicense(data: LicenseVerificationData): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Save file locally
    const fileExt = data.file?.name.split(".").pop();
    const fileName = `${data.licenseNumber.replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;
    const filePath = path.join(process.cwd(), "public/uploads/licenses", fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    if (!data.file) {
      throw new Error('No file provided for license upload');
    }
    const buffer = Buffer.from(await data.file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create license record
    await prisma.license.create({
      data: {
        userId,
        licenseNumber: data.licenseNumber,
        issuingDate: data.issuingDate ? new Date(data.issuingDate) : new Date(),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : new Date(),
        licenseType: data.licenseType,
        filePath: `/uploads/licenses/${fileName}`,
      },
    });
  } catch (error) {
    console.error("Error creating license:", error);
    throw error;
  }
}

export async function createVehicle(data: VehicleComplianceData): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Save label photo
    const labelExt = data.labelPhoto?.name.split(".").pop();
    const labelFileName = `vehicle-${data.vehicleReg.replace(/\s+/g, "-")}-label-${Date.now()}.${labelExt}`;
    const labelPath = path.join(process.cwd(), "public/uploads/vehicles", labelFileName);
    await mkdir(path.dirname(labelPath), { recursive: true });
    if (!data.labelPhoto) throw new Error("Label photo is required");
    const labelBuffer = Buffer.from(await data.labelPhoto.arrayBuffer());
    await writeFile(labelPath, labelBuffer);

    // Save sealing photo (if provided)
    let sealingPath: string | undefined;
    if (data.sealingPhoto) {
      const sealingExt = data.sealingPhoto?.name.split(".").pop();
      const sealingFileName = `vehicle-${data.vehicleReg.replace(/\s+/g, "-")}-sealing-${Date.now()}.${sealingExt}`;
      sealingPath = path.join(process.cwd(), "public/uploads/vehicles", sealingFileName);
      await mkdir(path.dirname(sealingPath), { recursive: true });
      if (!data.sealingPhoto) throw new Error("Sealing photo is required");
      const sealingBuffer = Buffer.from(await data.sealingPhoto.arrayBuffer());
      await writeFile(sealingPath, sealingBuffer);
      sealingPath = `/uploads/vehicles/${sealingFileName}`;
    }

    // Create vehicle record
    await prisma.vehicle.create({
      data: {
        userId,
        registrationNumber: data.vehicleReg,
        vehicleType: data.vehicleType,
        capacity: data.vehicleCapacity,
        labelPhotoPath: `/uploads/vehicles/${labelFileName}`,
        sealingPhotoPath: sealingPath,
        approvedRoutes: data.routes,
      },
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
}

export async function updateOnboardingStatus(
  onboardingStep: string,
  onboardingCompleted: boolean
): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.profile.update({
      where: { userId },
      data: { onboardingStep, onboardingCompleted },
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    throw error;
  }
}

export async function uploadFile(folder: string, fileName: string, file: File): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "public/uploads", folder, fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}