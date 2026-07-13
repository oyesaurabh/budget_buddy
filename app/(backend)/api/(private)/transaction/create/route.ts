import prisma from "@/lib/db";
import {
  validateAccountOwnership,
  withErrorHandling,
  affectsBalance,
} from "@/utils";
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

  const amountPaise = amount * 100; // Convert to paisa
  const txnDate = new Date(date);

  // The account balance is a snapshot taken at balance_date, so only apply this
  // transaction to it when the transaction is dated on or after that snapshot.
  const account = await prisma.accounts.findUnique({
    where: { id: accountId },
    select: { balance_date: true },
  });
  const applyToBalance =
    !!account?.balance_date && affectsBalance(txnDate, account.balance_date);

  // Create transaction (and update balance atomically when applicable)
  let newTransaction;
  try {
    const [created] = await prisma.$transaction([
      prisma.transactions.create({
        data: {
          account_id: accountId,
          amount: amountPaise,
          date: txnDate,
          category_id: categoryId || null,
          payee,
          cheque_no: cheque_no || null,
          notes: notes || null,
        },
      }),
      ...(applyToBalance
        ? [
            prisma.accounts.update({
              where: { id: accountId },
              data: { balance: { increment: amountPaise } },
            }),
          ]
        : []),
    ]);
    newTransaction = created;
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
