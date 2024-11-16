import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/utils/auth";

export const authMiddlewareAPI = async (request: NextRequest) => {
  try {
    const sessiontoken = request.cookies.get("sessionToken")?.value;
    if (!sessiontoken || !checkSession(sessiontoken))
      throw new Error("Invalid or Expired Session");

    return NextResponse.next();
  } catch (error) {
    throw new Error("Server Error");
  }
};
export const authMiddlewareFrontend = async (request: NextRequest) => {
  const sessiontoken = request.cookies.get("sessionToken")?.value;
  if (!sessiontoken || !checkSession(sessiontoken))
    return NextResponse.redirect(new URL("/authenticate", request.nextUrl));

  return NextResponse.next();
};
