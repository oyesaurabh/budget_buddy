import { NextResponse, NextRequest } from "next/server";
import { customMiddleware } from "./middlewareUtils/main";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  for (const { matcher, middleware } of customMiddleware) {
    if (pathname.match(new RegExp(matcher))) {
      return await middleware(request);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/api/:path*",
    "/app/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
