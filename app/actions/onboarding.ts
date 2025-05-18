// app/actions/onboarding.ts (server)

import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { id: userId }, // or userId if that's the primary key
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    role?: string;
    onboardingStep?: string;
    onboardingCompleted?: boolean;
  }
) {
  return prisma.profile.update({
    where: { id: userId },
    data,
  });
}
