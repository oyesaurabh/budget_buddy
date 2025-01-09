import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling, validateAccountOwnership } from "@/utils";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

const getTransactions = async (request: NextRequest) => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);
  const body = await request.json();
  const { from, to, accountId } = body;

  if (!accountId)
    return NextResponse.json(
      {
        status: false,
        message: "Incomplete request: Account ID is required",
      },
      { status: 400 }
    );

  const isOwner = await validateAccountOwnership(userId, accountId);
  if (!isOwner)
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized: Account does not belong to user",
      },
      { status: 403 }
    );

  const today = new Date();
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(today.getDate() - 30);

  const finalStartDate = from ? new Date(from) : defaultStartDate;
  const finalEndDate = to ? new Date(to) : today;

  const startDate = finalStartDate.toISOString().slice(0, 10);
  const endDate = finalEndDate.toISOString().slice(0, 10);

  try {
    const response = await prisma.$queryRaw`
      SELECT 
        t.id, 
        cat.name AS category_name, 
        t.category_id as "categoryId", 
        t.payee, 
        t.amount, 
        t.notes, 
        ac.name AS account_name, 
        t.account_id as "accountId",
        t.date
      FROM transactions t 
      JOIN accounts ac ON ac.id = t.account_id
      LEFT JOIN categories cat ON cat.id = t.category_id
      WHERE t.date BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp 
        AND ac.user_id = ${userId}
        ${
          accountId ? Prisma.sql`AND t.account_id = ${accountId}` : Prisma.empty
        }
      ORDER BY t.date DESC
    `;

    return NextResponse.json({
      status: true,
      message: "successful",
      data: response,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching transactions");
  }
};
const editTransaction = async (request: NextRequest) => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  const body = await request.json();
  const {
    id,
    amount,
    notes,
    payee,
    date,
    accountId: account_id,
    categoryId: category_id,
  } = body;
  const parsedAmount = parseInt(amount, 10);
  if (isNaN(parsedAmount)) {
    throw new Error("Invalid amount");
  }

  const isOwner = await validateAccountOwnership(userId, account_id); //TODO: need to validate transaction ownership
  if (!isOwner)
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized: Account does not belong to user",
      },
      { status: 403 }
    );

  try {
    await prisma.transactions.update({
      where: {
        id: id,
      },
      data: {
        amount: parsedAmount,
        notes,
        payee,
        date,
        account_id,
        category_id,
      },
    });

    return NextResponse.json({
      status: true,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while updating transaction");
  }
};
const deleteTransaction = async (request: NextRequest) => {
  // const sessionHeader = request.headers.get("x-user-session");
  // if (!sessionHeader) {
  //   throw new Error("Invalid session");
  // }
  // const { userId } = JSON.parse(sessionHeader);

  // const ids = await request.json();
  const ids = await request.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { status: false, message: "No IDs provided for deletion." },
      { status: 400 }
    );
  }
  // const isOwner = await validateAccountOwnership(userId, id); //TODO: need to validate transaction ownership
  // if (!isOwner)
  //   return NextResponse.json(
  //     {
  //       status: false,
  //       message: "Unauthorized: Account does not belong to user",
  //     },
  //     { status: 403 }
  //   );

  let deleteResponse;
  try {
    deleteResponse = await prisma.transactions.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    throw new Error("Error while deleting accounts");
  }
  return NextResponse.json(
    {
      status: true,
      message: `${deleteResponse.count} transaction(s) deleted successfully`,
    },
    { status: 200 }
  );
};
export const POST = withErrorHandling(getTransactions);
export const PATCH = withErrorHandling(editTransaction);
export const DELETE = withErrorHandling(deleteTransaction);
