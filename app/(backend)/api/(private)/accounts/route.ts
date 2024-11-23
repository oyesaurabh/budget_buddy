import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withErrorHandling } from "@/utils";

async function getAccounts(request: NextRequest) {
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
}
// const createAccount = (request: NextRequest) => {};

export const GET = withErrorHandling(getAccounts);
// export const POST = withErrorHandling(createAccount);
