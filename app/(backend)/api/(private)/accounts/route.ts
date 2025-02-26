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
      select: { name: true, id: true, balance: true, balance_date: true },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error while fetching accounts");
  }
  //converting balance to rupees from paisa
  data = data.map((account) => {
    return {
      ...account,
      balance: account.balance / 100,
    };
  });
  return NextResponse.json({
    status: true,
    message: "Successfull",
    data: data,
  });
}
const createAccount = async (request: NextRequest) => {
  const body = await request.json();
  const parsedBody = accountSchema.parse(body);
  const { name } = parsedBody;
  let { balance, balance_date } = parsedBody;
  if (!name) {
    return NextResponse.json(
      {
        status: false,
        message: "Name is required",
      },
      { status: 400 }
    );
  }
  balance_date = balance_date ?? new Date();
  balance = balance ? balance * 100 : 0;

  //taking our userid from req header
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId: user_id } = JSON.parse(sessionHeader);

  //now simply save data into db
  let res;
  try {
    res = await prisma.accounts.create({
      data: {
        name,
        user_id,
        balance,
        balance_date,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error while creating account");
  }

  return NextResponse.json(
    {
      status: true,
      message: "Account Created Successfully",
      data: {
        id: res.id,
        name: res.name,
        balance: res.balance / 100, // converting to rupees from paisa
        balance_date: res.balance_date,
      },
    },
    { status: 200 }
  );
};

type EditAccountPayload = {
  id: string;
  name?: string;
  balance?: number;
};
const editAccount = async (request: NextRequest) => {
  try {
    const payload: EditAccountPayload = await request.json();
    const { id, name, balance } = payload;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          status: false,
          message: "Account ID is required",
        },
        { status: 400 }
      );
    }

    // Prepare the update data based on what was provided
    type updatedef = {
      name?: string;
      balance?: number;
      balance_date?: Date;
    };
    const updateData: updatedef = {};
    if (name !== undefined) {
      updateData.name = name;
    }

    if (balance !== undefined) {
      updateData.balance = balance * 100; // converting to paisa from rupees
      updateData.balance_date = new Date();
    }

    // Only proceed with update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        status: false,
        message: "No valid fields to update",
      });
    }

    await prisma.accounts.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: true,
      message: "Successfully updated account",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: false,
        message: "Error while updating account",
      },
      { status: 500 }
    );
  }
};
export const GET = withErrorHandling(getAccounts);
export const POST = withErrorHandling(createAccount);
export const PATCH = withErrorHandling(editAccount);
