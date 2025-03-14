import { joseService, redisService } from "@/services";

// Function to check session using jwt
export const checkSession = async (
  sessionToken: string,
  headers?: Headers
): Promise<boolean> => {
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
};
