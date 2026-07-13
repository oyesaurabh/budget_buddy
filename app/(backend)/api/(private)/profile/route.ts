import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const getUserId = (request: NextRequest): string => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) throw new Error("Invalid session");
  return JSON.parse(sessionHeader).userId;
};

const getProfile = async (request: NextRequest) => {
  const userId = getUserId(request);

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { name: true, email: true, avatar_url: true },
  });

  if (!user) {
    return NextResponse.json(
      { status: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: true, message: "Successful", data: user });
};

const updateProfile = async (request: NextRequest) => {
  const userId = getUserId(request);
  const body = await request.json();
  const { name, avatar_url } = body;

  const data: { name?: string; avatar_url?: string | null } = {};

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (trimmed.length < 3) {
      return NextResponse.json(
        { status: false, message: "Name should have at least 3 characters" },
        { status: 400 }
      );
    }
    data.name = trimmed;
  }

  if (avatar_url !== undefined) {
    const url = avatar_url === null ? null : String(avatar_url).trim();
    if (url && !/^https?:\/\/.+/i.test(url)) {
      return NextResponse.json(
        { status: false, message: "Enter a valid image URL (http/https)" },
        { status: 400 }
      );
    }
    data.avatar_url = url || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { status: false, message: "Nothing to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.users.update({
    where: { id: userId },
    data,
    select: { name: true, email: true, avatar_url: true },
  });

  return NextResponse.json({
    status: true,
    message: "Profile updated",
    data: updated,
  });
};

export const GET = withErrorHandling(getProfile);
export const PATCH = withErrorHandling(updateProfile);
