import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Redis } from "@upstash/redis";
// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

import { withErrorHandling } from "@/utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);
const logoutUser = async (request: NextRequest) => {
  try {
    // Verify and decode the JWT to get the user ID and session token
    const jwtToken = request.cookies.get("sessionToken")?.value;
    if (!jwtToken) {
      return NextResponse.json(
        { status: false, message: "No session found" },
        { status: 401 }
      );
    }
    const { payload } = await jwtVerify(jwtToken, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const decoded = payload as {
      userId: string;
      sessionToken: string;
    };

    // Remove the user session from redis
    const userSessionKey = `user_session:${decoded.userId}`;
    await redis.del(userSessionKey);

    // Create a response to clear the Authorization cookie
    const response = NextResponse.json(
      { status: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the Authorization cookie
    response.cookies.set("sessionToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Immediately expire the cookie
    });

    return response;
  } catch (error) {
    // Handle invalid or expired token
    return NextResponse.json(
      { status: false, message: "Invalid session" },
      { status: 401 }
    );
  }
};

export const POST = withErrorHandling(logoutUser);
