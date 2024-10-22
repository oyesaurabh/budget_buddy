import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middleware as customMiddleware } from "./middleware/index";

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
  matcher: ["/api/:path*"],
};
