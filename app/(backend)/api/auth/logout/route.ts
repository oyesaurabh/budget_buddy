import { NextRequest, NextResponse } from "next/server";

import { redisService, joseService } from "@/services";
import { withErrorHandling } from "@/utils";

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
    const { userId } = await joseService.verify(jwtToken);

    // Remove the user session from redis
    const userSessionKey = `user_session:${userId}`;
    await redisService.delete(userSessionKey);

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
