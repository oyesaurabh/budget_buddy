import { joseService, redisService } from "@/services";

// Function to check session using jwt
export const checkSession = async (sessionToken: string) => {
  try {
    // Verify the JWT token using jose
    const { userId } = await joseService.verify(sessionToken);

    // Check if the session token matches the one stored for this user
    const userSessionKey = `user_session:${userId}`;
    const storedJwtToken = await redisService.get(userSessionKey);

    // If no stored token or stored token doesn't match the current token
    if (!storedJwtToken || storedJwtToken !== sessionToken) {
      console.error("Session invalidated (logged in from another device)");
      return false;
    }
    return true;
  } catch (error: any) {
    // Handle different types of JWT errors
    if (error.name === "JWTExpired") {
      console.error("Session token expired");
    } else if (error.name === "JWTInvalid") {
      console.error("Invalid token");
    }

    return false;
  }
};
