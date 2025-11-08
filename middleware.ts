// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const enabled = process.env.ENABLE_BASIC_AUTH === "true";
  if (!enabled) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const EXCLUDES = ["/favicon.ico", "/robots.txt", "/sitemap.xml"];
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/api/health") ||
    EXCLUDES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const user = process.env.BASIC_AUTH_USER ?? "";
  const pass = process.env.BASIC_AUTH_PASS ?? "";

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) return NextResponse.next();
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = { matcher: ["/((?!.*\\.).*)"] };
