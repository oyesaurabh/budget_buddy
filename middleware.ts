import { NextResponse, NextRequest } from "next/server";
import { customMiddleware } from "./middlewareUtils/main";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    for (const { matcher, middleware } of customMiddleware) {
      if (pathname.match(new RegExp(matcher))) {
        return await middleware(request);
      }
    }

    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error?.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
export const config = {
  matcher: [
    "/api/:path*",
    "/app/:path*",
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)",
  ],
};
