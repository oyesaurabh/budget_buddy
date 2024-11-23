import { NextResponse, NextRequest } from "next/server";
import { authMiddlewareAPI, authMiddlewareFrontend } from "@/services";

export async function middleware(request: NextRequest) {
  // Define API routes pattern
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  try {
    // Apply different middleware based on route type
    if (isApiRoute) {
      return await authMiddlewareAPI(request);
    } else {
      return await authMiddlewareFrontend(request);
    }
  } catch (error) {
    if (isApiRoute) {
      return NextResponse.json(
        {
          status: false,
          message:
            error instanceof Error ? error.message : "Authentication failed",
        },
        { status: 401 }
      );
    } else {
      const loginUrl = new URL("/authenticate", request.nextUrl);
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
