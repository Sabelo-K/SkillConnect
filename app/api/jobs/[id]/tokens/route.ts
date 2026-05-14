import { NextRequest, NextResponse } from "next/server";
import { generateJobTokens } from "@/lib/store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tokens = await generateJobTokens(id);
    return NextResponse.json(tokens);
  } catch {
    return NextResponse.json({ error: "Failed to generate tokens" }, { status: 500 });
  }
}
