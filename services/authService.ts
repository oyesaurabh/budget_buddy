import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/utils/session";

const authMiddlewareAPI = async (request: NextRequest) => {
  const sessiontoken = request.cookies.get("sessionToken")?.value;
  if (!sessiontoken || !(await checkSession(sessiontoken)))
    throw new Error("Invalid or Expired Session");
  return NextResponse.next();
};
const authMiddlewareFrontend = async (request: NextRequest) => {
  const sessiontoken = request.cookies.get("sessionToken")?.value;
  if (!sessiontoken || !(await checkSession(sessiontoken)))
    return NextResponse.redirect(new URL("/authenticate", request.nextUrl));

  return NextResponse.next();
};

export const customMiddleware = [
  {
    matcher: "^/api/auth",
    middleware: authMiddlewareAPI,
  },
  {
    matcher: "^/app",
    middleware: authMiddlewareFrontend,
  },
];
