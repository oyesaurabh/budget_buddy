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

  // getting all the accounts data of user.
  let data;
  try {
    data = await prisma.accounts.findMany({
      where: { user_id: userId },
      select: { name: true, id: true },
    });
  } catch (err) {
    throw new Error("Error while fetching accounts");
  }

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
  let res;
  try {
    res = await prisma.accounts.create({
      data: {
        name,
        user_id: userId,
      },
    });
  } catch (error) {
    throw new Error("Error while creating account");
  }

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
  try {
    await prisma.accounts.update({
      where: { id },
      data: { name },
    });
  } catch (err) {
    throw new Error("Error while updating account");
  }

  return NextResponse.json({
    status: true,
    message: "successfully updated",
  });
};
export const GET = withErrorHandling(getAccounts);
export const POST = withErrorHandling(createAccount);
export const PATCH = withErrorHandling(editAccount);
