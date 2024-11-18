import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      throw new Error("Invalid session");
    }
    const { userId } = JSON.parse(sessionHeader);

    // //getting all the accounts data of user.
    const data = prisma.accounts.findMany({
      where: { userId },
      select: { name: true },
    });

    return NextResponse.json({
      status: true,
      message: "Successfull",
      data: data,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      status: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: [],
    });
  }
}
