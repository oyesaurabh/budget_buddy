import { jwtVerify } from "jose";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

// Function to check session using jwt
export const checkSession = async (sessionToken: string) => {
  try {
    // Verify the JWT token using jose
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const decoded = payload as {
      userId: string;
      sessionToken: string;
      iat?: number;
      exp?: number;
    };

    // Check if the session token matches the one stored for this user
    const userSessionKey = `user_session:${decoded.userId}`;
    const storedJwtToken = await redis.get(userSessionKey);

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
