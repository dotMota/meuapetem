import { NextResponse } from "next/server";
import { corretores } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: corretores });
}
