import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { withErrorHandling, signinSchema, hashPassword, randomHash } from "@/utils";
import { redisService, joseService } from "@/services";
import { UAParser } from "ua-parser-js";
import { sendLoginNotification } from "@/services/emailService";

const loginUser = async (request: NextRequest) => {
  // VERIFYING USERS PASSWORD
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
  const hashedPassword = await hashPassword(user.salt, password);
  if (hashedPassword !== user.password) throw new Error("Incorrect Password");

  // PASSWORD VERIFIED, SEND LOGIN NOTIFICATION EMAIL
  const uaString = request.headers.get("user-agent") || "";
  const parser = new UAParser(uaString);
  const ua = parser.getResult();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
  const loginDetails = {
    browser: `${ua.browser.name} ${ua.browser.version}`,
    os: `${ua.os.name} ${ua.os.version}`,
    device: ua.device.model ? `${ua.device.vendor} ${ua.device.model}` : "Desktop/Laptop",
    location: request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity") || "Unknown Location", // Vercel specific
    ip: ip,
    time:
      new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "short",
      }) + " UTC",
  };
  sendLoginNotification(user.email, user.name, loginDetails).catch((error) =>
    console.error("Failed to send login notification:", error)
  );

  // CREATING USER SESSION
  const sessionToken = await randomHash();
  const jwtPayload = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    sessionToken: sessionToken,
    loginTimestamp: Date.now(),
  };

  const jwtToken = await joseService.sign(jwtPayload);
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

  response.cookies.set("sessionToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
};

export const POST = withErrorHandling(loginUser);
