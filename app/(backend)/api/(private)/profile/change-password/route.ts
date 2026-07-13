import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling, hashPassword, randomHash } from "@/utils";
import { redisService } from "@/services";
import { sendOtpEmail } from "@/services/emailService";
import prisma from "@/lib/db";

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const otpKey = (userId: string) => `pwd_otp:${userId}`;

const getSession = (request: NextRequest) => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) throw new Error("Invalid session");
  return JSON.parse(sessionHeader) as {
    userId: string;
    userName: string;
    userEmail: string;
  };
};

const isValidPassword = (password: unknown): password is string =>
  typeof password === "string" &&
  password.trim().length >= 6 &&
  /[a-zA-Z]/.test(password) &&
  /[0-9]/.test(password);

// Step 1: generate an OTP and email it to the user
const requestOtp = async (request: NextRequest) => {
  const { userId, userName, userEmail } = getSession(request);

  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  await redisService.set(otpKey(userId), otp, OTP_TTL_SECONDS);

  const sent = await sendOtpEmail(userEmail, userName, otp);
  if (!sent) {
    return NextResponse.json(
      { status: false, message: "Could not send the verification email" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: true,
    message: `Verification code sent to ${userEmail}`,
  });
};

// Step 2: verify the OTP and set the new password
const verifyAndChange = async (request: NextRequest) => {
  const { userId } = getSession(request);
  const { otp, newPassword } = await request.json();

  if (!otp) {
    return NextResponse.json(
      { status: false, message: "Verification code is required" },
      { status: 400 }
    );
  }
  if (!isValidPassword(newPassword)) {
    return NextResponse.json(
      {
        status: false,
        message:
          "Password must be at least 6 characters and include a letter and a number",
      },
      { status: 400 }
    );
  }

  const storedOtp = await redisService.get(otpKey(userId));
  if (!storedOtp) {
    return NextResponse.json(
      { status: false, message: "Code expired, please request a new one" },
      { status: 400 }
    );
  }
  if (String(storedOtp) !== String(otp)) {
    return NextResponse.json(
      { status: false, message: "Invalid verification code" },
      { status: 400 }
    );
  }

  // Rotate salt and store the new password hash
  const salt = await randomHash();
  const hashedPassword = await hashPassword(salt, newPassword);
  await prisma.users.update({
    where: { id: userId },
    data: { password: hashedPassword, salt },
  });

  await redisService.delete(otpKey(userId));

  return NextResponse.json({
    status: true,
    message: "Password changed successfully",
  });
};

export const POST = withErrorHandling(requestOtp);
export const PATCH = withErrorHandling(verifyAndChange);
