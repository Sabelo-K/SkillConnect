import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "SkillConnect2025!";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = request.cookies.get("sc_admin");
    if (cookie?.value !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
