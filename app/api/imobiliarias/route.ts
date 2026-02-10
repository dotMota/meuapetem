import { NextResponse } from "next/server";
import { imobiliarias } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: imobiliarias });
}
