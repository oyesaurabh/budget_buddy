import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    // const { userId } = body;
    // if (!userId) throw new Error("no user id");

    //getting all the accounts data of user.
    // const data = prisma.accounts.findMany({
    //   where: { userId },
    //   select: { name: true },
    // });

    return NextResponse.json({
      status: true,
      // data: data,
      data: [],
    });
  } catch (error: unknown) {
    return NextResponse.json({
      status: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
