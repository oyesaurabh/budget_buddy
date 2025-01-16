import prisma from "@/lib/db";
import { validateAccountOwnership, withErrorHandling } from "@/utils";
import { transactionSchema } from "@/utils/schema";
import { NextRequest, NextResponse } from "next/server";

const createTransactions = async (request: NextRequest) => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  // Parse the request body
  const body = await request.json();
  const { accountId, amount, date, categoryId, payee, notes, cheque_no } =
    transactionSchema.parse(body);
  if (!accountId || !amount || !date || !payee) {
    return NextResponse.json({
      status: false,
      message: "Missing required fields",
    });
  }

  const isOwner = await validateAccountOwnership(userId, accountId);
  if (!isOwner)
    return NextResponse.json(
      {
        status: false,
        message: "Unauthorized: Account does not belong to user",
      },
      { status: 403 }
    );

  // Create transaction
  let newTransaction;
  try {
    newTransaction = await prisma.transactions.create({
      data: {
        account_id: accountId,
        amount: amount * 100, // Convert to paisa
        date: new Date(date),
        category_id: categoryId || null,
        payee,
        cheque_no: cheque_no || null,
        notes: notes || null,
      },
    });
  } catch (error) {
    throw new Error("Error while creating transaction");
  }

  return NextResponse.json({
    status: true,
    message: "Transaction created successfully",
    data: newTransaction,
  });
};

export const POST = withErrorHandling(createTransactions);
