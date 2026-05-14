import { createHmac } from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "SkillConnect2025!";

export function getSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-in-production";
  return createHmac("sha256", secret)
    .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:sc_v2`)
    .digest("hex");
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === getSessionToken();
}

export function requireAdmin(request: NextRequest): Response | null {
  const cookie = request.cookies.get("sc_admin");
  if (!isValidSession(cookie?.value)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}
