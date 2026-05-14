import { NextRequest, NextResponse } from "next/server";
import { generateJobTokens } from "@/lib/store";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(_req);
  if (deny) return deny;
  try {
    const { id } = await params;
    const tokens = await generateJobTokens(id);
    return NextResponse.json(tokens);
  } catch {
    return NextResponse.json({ error: "Failed to generate tokens" }, { status: 500 });
  }
}
