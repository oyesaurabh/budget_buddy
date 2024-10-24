import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // const data = await prisma.user.findFirst();
    const data = await prisma.$queryRaw`select * from "User"`;
    return NextResponse.json({
      status: true,
      data: data,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
