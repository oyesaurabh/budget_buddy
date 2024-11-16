import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  hashPassword,
  withErrorHandling,
  randomHash,
  signinSchema,
} from "@/utils";
import jwt from "jsonwebtoken";

const MAX_ACTIVE_SESSIONS = parseInt(
  process.env.MAX_ACTIVE_SESSIONS ?? "2",
  10
);

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const loginUser = async (request: NextRequest) => {
  const body = await request.json();
  const { email, password } = signinSchema.parse(body);

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) throw new Error("No User Found");

  // Verify the password
  const hashedPassword = await hashPassword(user.salt, password);
  if (hashedPassword !== user.password) throw new Error("Incorrect Password");

  // Parse the user's active sessions from the database
  let activeSessions = user.activeSessions || [];
  if (activeSessions.length >= MAX_ACTIVE_SESSIONS) {
    activeSessions = activeSessions.slice(1);
  }

  // Generate a new session token (using a timestamp and random hash)
  const sessionToken = await randomHash();
  const expiresIn = "1d";

  // Create a JWT token containing session details
  const jwtPayload = {
    userId: user.id,
    sessionToken: sessionToken,
    loginTimestamp: Date.now(),
  };

  const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn });

  // Update the user's active session tokens in the database
  await prisma.users.update({
    where: { id: user.id },
    data: {
      activeSessions: [...activeSessions, sessionToken], // Add new session token
    },
  });

  const response = NextResponse.json(
    { status: true, message: "Authorized" },
    { status: 200 }
  );
  // Set the JWT in the response as a cookie
  response.cookies.set("sessionToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 days
  });

  return response;
};

export const POST = withErrorHandling(loginUser);
