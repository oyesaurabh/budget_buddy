import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withErrorHandling } from "@/utils";
import { accountSchema } from "@/utils/schema";

async function getAccounts(request: NextRequest) {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  // //getting all the accounts data of user.
  const data = await prisma.accounts.findMany({
    where: { userId },
    select: { name: true, id: true },
  });

  return NextResponse.json({
    status: true,
    message: "Successfull",
    data: data,
  });
}
const createAccount = async (request: NextRequest) => {
  const body = await request.json();
  const { name } = accountSchema.parse(body);

  //taking our userid from req header
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  //now simply save data into db
  await prisma.accounts.create({
    data: {
      name,
      userId,
    },
  });

  return NextResponse.json(
    { status: true, message: "Account Created Successfully" },
    { status: 200 }
  );
};

export const GET = withErrorHandling(getAccounts);
export const POST = withErrorHandling(createAccount);
