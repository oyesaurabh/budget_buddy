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
  const res = await prisma.accounts.create({
    data: {
      name,
      userId,
    },
  });

  return NextResponse.json(
    {
      status: true,
      message: "Account Created Successfully",
      data: { id: res.id, name: res.name },
    },
    { status: 200 }
  );
};
const editAccount = async (request: NextRequest) => {
  const { name, id } = await request.json();
  if (!!name == false || !!id == false)
    return NextResponse.json({
      status: false,
      message: "Invalid Body Params",
    });

  //updating
  await prisma.accounts.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json({
    status: true,
    message: "successfully updated",
  });
};
export const GET = withErrorHandling(getAccounts);
export const POST = withErrorHandling(createAccount);
export const PATCH = withErrorHandling(editAccount);
