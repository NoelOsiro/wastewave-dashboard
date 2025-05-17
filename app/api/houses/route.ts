import { NextResponse } from "next/server";
import { HouseFormValues } from "@/lib/types";
import { createHouse } from "@/utils/houses";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as HouseFormValues;
    const result = await createHouse(data);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, data: null, error: errorMessage },
      { status: 500 }
    );
  }
}