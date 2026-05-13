import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "SkillConnect2025!";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("sc_admin", ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
