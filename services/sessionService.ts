import { NextRequest, NextResponse } from "next/server";
import { joseService, redisService } from "@/services";

interface SessionData {
  userId: string;
  userName?: string;
  userEmail?: string;
  // Add other session-related fields as needed
}

export class SessionService {
  /**
   * Verifies session token and updates headers if provided
   * @returns boolean indicating if session is valid
   */
  static async validateSession(
    sessionToken: string,
    headers?: Headers
  ): Promise<boolean> {
    try {
      // Verify the JWT token using jose
      const { userId, userName, userEmail } = await joseService.verify(
        sessionToken
      );

      // Check if the session token matches the one stored for this user
      const userSessionKey = `user_session:${userId}`;
      const storedJwtToken = await redisService.get(userSessionKey);

      if (!storedJwtToken || storedJwtToken !== sessionToken) {
        console.error("Session invalidated (logged in from another device)");
        return false;
      }

      // If headers are provided (API routes), set session info
      if (headers) {
        headers.set(
          "x-user-session",
          JSON.stringify({ userId, userName, userEmail })
        );
      }

      return true;
    } catch (error: any) {
      if (error.name === "JWTExpired") {
        console.error("Session token expired");
      } else if (error.name === "JWTInvalid") {
        console.error("Invalid token");
      }
      return false;
    }
  }

  /**
   * Gets session token from request cookies
   * @throws Error if session token is missing
   */
  static getSessionToken(request: NextRequest): string {
    const sessionToken = request.cookies.get("sessionToken")?.value;
    if (!sessionToken) {
      throw new Error("Session token missing");
    }
    return sessionToken;
  }

  /**
   * Extracts and validates session data from request headers
   * @throws Error if session is invalid or missing
   */
  static getSessionData(request: NextRequest): SessionData {
    const sessionHeader = request.headers.get("x-user-session");

    if (!sessionHeader) {
      throw new Error("Invalid session");
    }

    try {
      const sessionData = JSON.parse(sessionHeader) as SessionData;

      if (!sessionData.userId) {
        throw new Error("Invalid session data");
      }

      return sessionData;
    } catch (error) {
      throw new Error("Failed to parse session data");
    }
  }

  /**
   * Gets only the user ID from session
   * @throws Error if session is invalid or missing
   */
  static getUserId(request: NextRequest): string {
    const { userId } = this.getSessionData(request);
    return userId;
  }

  /**
   * Safely checks if a session exists without throwing
   */
  static hasValidSession(request: NextRequest): boolean {
    try {
      this.getSessionData(request);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Complete session validation including token and header checks
   * @returns Promise<boolean> indicating if session is fully valid
   */
  static async validateRequestSession(
    request: NextRequest,
    headers?: Headers
  ): Promise<boolean> {
    try {
      const sessionToken = this.getSessionToken(request);
      return await this.validateSession(sessionToken, headers);
    } catch {
      return false;
    }
  }
}

// Example usage in middleware:
export async function authMiddleware(request: NextRequest) {
  try {
    const newHeaders = new Headers(request.headers);
    const isValid = await SessionService.validateRequestSession(
      request,
      newHeaders
    );

    if (!isValid) {
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
  } catch (error) {
    // Handle error appropriately
    throw error;
  }
}

// Example usage in API route:
export async function POST(request: NextRequest) {
  try {
    const userId = SessionService.getUserId(request);
    // Your API logic here...
  } catch (error: unknown) {
    return NextResponse.json({
      status: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: [],
    });
  }
}
