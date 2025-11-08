// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // オン/オフ切替（.env / Vercelの環境変数で制御）
  const enabled = process.env.ENABLE_BASIC_AUTH === "true";
  if (!enabled) return NextResponse.next();

  // 除外したいパス（静的ファイルや画像、ヘルスチェックなど）
  const { pathname } = req.nextUrl;
  const EXCLUDES = [
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ];
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
      const decoded = atob(encoded); // Edge Runtime で利用可
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  // 未認証なら 401 + WWW-Authenticate を返す（ブラウザのログインダイアログを出す）
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

// すべてのページを対象にしつつ、/_next 等は上で除外
export const config = {
  matcher: ["/((?!.*\\.).*)"], // 拡張子付きファイル以外
};
