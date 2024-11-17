import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, randomHash } from "@/utils/auth";
import { withErrorHandling, signinSchema } from "@/utils";
import { SignJWT } from "jose";
import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Convert JWT secret to Uint8Array for jose
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);
export const loginUser = async (request: NextRequest) => {
  const body = await request.json();
  const { email, password } = signinSchema.parse(body);

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) throw new Error("No User Found");

  // Verify the password
  const hashedPassword = await hashPassword(user.salt, password);
  if (hashedPassword !== user.password) throw new Error("Incorrect Password");

  // Generate a new session token
  const sessionToken = await randomHash();

  // Create a JWT token containing session details
  const jwtPayload = {
    userId: user.id,
    sessionToken: sessionToken,
    loginTimestamp: Date.now(),
  };

  // Sign JWT using jose instead of jsonwebtoken
  const jwtToken = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d") // 1 day
    .setIssuedAt()
    .sign(JWT_SECRET);

  // Store the new session token for user
  const userSessionKey = `user_session:${user.id}`;
  await redis.set(userSessionKey, jwtToken, { ex: 86400 }); // Expire in 1 day

  const response = NextResponse.json(
    { status: true, message: "Authorized" },
    { status: 200 }
  );

  // Set the JWT in the response as a cookie
  response.cookies.set("sessionToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
};

export const POST = withErrorHandling(loginUser);
