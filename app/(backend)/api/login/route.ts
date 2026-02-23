import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import { withErrorHandling, signinSchema, hashPassword, randomHash } from "@/utils";
import { redisService, joseService } from "@/services";
import { UAParser } from "ua-parser-js";
import { sendLoginNotification } from "@/services/emailService";

const isProduction = process.env.NODE_ENV === "production";

const buildLoginDetails = (request: NextRequest) => {
  const ua = new UAParser(request.headers.get("user-agent") || "").getResult();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
  const time =
    new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " UTC";

  return {
    browser: `${ua.browser.name} ${ua.browser.version}`,
    os: `${ua.os.name} ${ua.os.version}`,
    device: ua.device.model ? `${ua.device.vendor} ${ua.device.model}` : "Desktop/Laptop",
    location: request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity") || "Unknown Location",
    ip,
    time,
  };
};

const loginUser = async (request: NextRequest) => {
  // VERIFY USER + PASSWORD
  const { email, password } = signinSchema.parse(await request.json());

  const user = await prisma.users.findFirst({ where: { email } }).catch(() => {
    throw new Error("Error while fetching user");
  });

  if (!user)
    return NextResponse.json({ status: false, message: "No user found" }, { status: 404 });

  const hashedPassword = await hashPassword(user.salt, password);
  if (hashedPassword !== user.password) throw new Error("Incorrect Password");

  // SEND LOGIN NOTIFICATION EMAIL (production only)
  if (isProduction) {
    sendLoginNotification(user.email, user.name, buildLoginDetails(request)).catch((error: any) =>
      console.error("Failed to send login notification:", error)
    );
  }

  // CREATE USER SESSION
  const sessionToken = await randomHash();
  const jwtPayload = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    sessionToken,
    loginTimestamp: Date.now(),
  };

  const jwtToken = await joseService.sign(jwtPayload);
  await redisService.set(`user_session:${user.id}`, jwtToken, 60 * 60 * 24); // Expire in 1 day

  const response = NextResponse.json(
    { status: true, message: "Authorized", data: { name: user.name, email: user.email } },
    { status: 200 }
  );

  response.cookies.set("sessionToken", jwtToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
};

export const POST = withErrorHandling(loginUser);
