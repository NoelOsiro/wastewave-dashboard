import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, role, onboardingStep, onboardingCompleted } = await req.json();
    const client = await clerkClient()

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: userId },
      data: { role, onboardingStep, onboardingCompleted },
    });
    
    // Update Clerk user public metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    })

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: error as string}, { status: 500 });
  }
}
