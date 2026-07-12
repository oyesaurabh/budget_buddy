import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/utils/session";

export const authMiddlewareAPI = async (request: NextRequest) => {
  // Public routes that don't require authentication
  const publicRoutes = ["/api/login", "/api/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  //now handle private routes
  const sessionToken = request.cookies.get("sessionToken")?.value;
  if (!sessionToken) {
    throw new Error("Session token missing");
  }

  const newHeaders = new Headers(request.headers);
  const session = await checkSession(sessionToken, newHeaders);

  if (!session) {
    throw new Error("Invalid or Expired Session");
  }

  // Clone the request with modified headers
  const modifiedRequest = new NextRequest(request.url, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
  });

  return NextResponse.next({
    request: modifiedRequest,
  });
};
export const authMiddlewareFrontend = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/authenticate") ||
    pathname.startsWith("/assets/") ||
    pathname === "/logo.svg" ||
    pathname === "/logo-blue.svg";
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for valid session
  const sessionToken = request.cookies.get("sessionToken")?.value;
  if (!sessionToken || !(await checkSession(sessionToken))) {
    return NextResponse.redirect(new URL("/authenticate", request.nextUrl));
  }

  return NextResponse.next();
};
