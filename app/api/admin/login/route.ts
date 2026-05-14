import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERNAME, ADMIN_PASSWORD, getSessionToken } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    // Slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 1500));
    return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sc_admin", getSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
