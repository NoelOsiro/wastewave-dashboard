import { fetchProfile } from "@/utils/profile";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await fetchProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}