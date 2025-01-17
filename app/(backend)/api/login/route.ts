import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import {
  withErrorHandling,
  signinSchema,
  hashPassword,
  randomHash,
} from "@/utils";
import { redisService, joseService } from "@/services";

export const loginUser = async (request: NextRequest) => {
  const body = await request.json();
  const { email, password } = signinSchema.parse(body);

  let user;
  try {
    user = await prisma.users.findFirst({
      where: { email },
    });
    if (!user)
      return NextResponse.json(
        {
          status: false,
          message: "No user found",
        },
        { status: 404 }
      );
  } catch (error) {
    throw new Error("Error while fetching user");
  }

  // Verify the password
  const hashedPassword = await hashPassword(user.salt, password);
  if (hashedPassword !== user.password) throw new Error("Incorrect Password");

  // Generate a new session token
  const sessionToken = await randomHash();

  // Create a JWT token containing session details
  const jwtPayload = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    sessionToken: sessionToken,
    loginTimestamp: Date.now(),
  };

  // Sign JWT using jose instead of jsonwebtoken
  const jwtToken = await joseService.sign(jwtPayload);

  // Store the new session token of user into redis
  const userSessionKey = `user_session:${user.id}`;
  await redisService.set(userSessionKey, jwtToken, 60 * 60 * 24); // Expire in 1 day

  const response = NextResponse.json(
    {
      status: true,
      message: "Authorized",
      data: { name: user.name, email: user.email },
    },
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
