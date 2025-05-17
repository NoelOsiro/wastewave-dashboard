import { fetchProfile, updatePassword, updateProfile } from "@/utils/profile";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const profile = await fetchProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await updateProfile(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const result = await updatePassword(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}