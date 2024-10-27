import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authHeader.split(" ")[1];
    // Add your token verification logic here

    // If everything is okay, return next()
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
