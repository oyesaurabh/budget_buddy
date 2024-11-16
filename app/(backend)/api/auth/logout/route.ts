import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withErrorHandling } from "@/utils";
import jwt from "jsonwebtoken";

const logoutUser = async (request: NextRequest) => {
  // Extract the JWT token from the request cookies
  const jwtToken = request.cookies.get("sessionToken")?.value;

  if (!jwtToken) {
    return NextResponse.json(
      { status: false, message: "No active session" },
      { status: 400 }
    );
  }

  try {
    // Verify and decode the JWT to get the user ID and session token
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
    const decoded = jwt.verify(jwtToken, JWT_SECRET) as {
      userId: string;
      sessionToken: string;
    };

    // Remove the specific session token from the user's active sessions
    await prisma.users.update({
      where: { id: decoded.userId },
      data: {
        activeSessions: {
          // Remove the current session token from active sessions
          set: (
            await prisma.users.findUnique({
              where: { id: decoded.userId },
              select: { activeSessions: true },
            })
          )?.activeSessions.filter((token) => token !== decoded.sessionToken),
        },
      },
    });

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
