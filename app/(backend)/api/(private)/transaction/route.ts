import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling, validateAccountOwnership } from "@/utils";
import prisma from "@/lib/db";
import { transactionSchema } from "@/utils/schema";
import { z } from "zod";
type Transaction = z.infer<typeof transactionSchema>;

type BalanceEntry = { accountId: string; date: Date; amountPaise: number };

// Sum how much each account's balance should change, honouring the rule that a
// transaction only affects a balance when dated on or after that account's
// balance_date snapshot. Amounts are in paise (negative to reverse an effect).
const computeBalanceDeltas = async (
  entries: BalanceEntry[]
): Promise<Map<string, number>> => {
  const accountIds = [...new Set(entries.map((e) => e.accountId))];
  const accounts = await prisma.accounts.findMany({
    where: { id: { in: accountIds } },
    select: { id: true, balance_date: true },
  });
  const balanceDateById = new Map(accounts.map((a) => [a.id, a.balance_date]));

  const deltas = new Map<string, number>();
  for (const entry of entries) {
    const balanceDate = balanceDateById.get(entry.accountId);
    if (balanceDate && entry.date >= balanceDate) {
      deltas.set(
        entry.accountId,
        (deltas.get(entry.accountId) ?? 0) + entry.amountPaise
      );
    }
  }
  return deltas;
};

// Turn a deltas map into prisma account-update operations (skipping zero deltas)
const buildBalanceUpdates = (deltas: Map<string, number>) =>
  [...deltas.entries()]
    .filter(([, delta]) => delta !== 0)
    .map(([accountId, delta]) =>
      prisma.accounts.update({
        where: { id: accountId },
        data: { balance: { increment: delta } },
      })
    );

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
    let response: Transaction[] = await prisma.$queryRaw`
      SELECT 
        t.id, 
        cat.name AS category_name, 
        t.category_id as "categoryId", 
        t.payee, 
        t.amount, 
        t.notes, 
        ac.name AS account_name, 
        t.account_id as "accountId",
        t.date,
        t.cheque_no
      FROM transactions t 
      JOIN accounts ac ON ac.id = t.account_id
      LEFT JOIN categories cat ON cat.id = t.category_id
      WHERE t.date >= ${startDate}::date 
        AND t.date < (${endDate}::date + interval '1 day')
        AND ac.user_id = ${userId}
        AND t.account_id=${accountId}
      ORDER BY t.date DESC
    `;

    //converting amount from paisa to rupees
    response = response?.map((transaction: Transaction) => {
      return {
        ...transaction,
        amount: transaction?.amount / 100,
      };
    });

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
    cheque_no,
    accountId: account_id,
    categoryId: category_id,
  }: Transaction = body;
  const parsedAmount = amount * 100; //converting amount from rupees to paisa
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
    // Load the existing transaction so we can reverse its old balance effect
    const existing = await prisma.transactions.findUnique({
      where: { id },
      select: { amount: true, date: true, account_id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { status: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    const newDate = new Date(date);
    const delta = await computeBalanceDeltas([
      // Reverse the old transaction from its account
      { accountId: existing.account_id, date: existing.date, amountPaise: -existing.amount },
      // Apply the edited transaction to its (possibly new) account
      { accountId: account_id, date: newDate, amountPaise: parsedAmount },
    ]);

    await prisma.$transaction([
      prisma.transactions.update({
        where: { id: id },
        data: {
          amount: parsedAmount,
          notes,
          payee,
          date,
          cheque_no,
          account_id,
          category_id,
        },
      }),
      ...buildBalanceUpdates(delta),
    ]);

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
    // Load the transactions first so we can reverse their balance effect
    const txns = await prisma.transactions.findMany({
      where: { id: { in: ids } },
      select: { amount: true, date: true, account_id: true },
    });

    const deltas = await computeBalanceDeltas(
      txns.map((t) => ({
        accountId: t.account_id,
        date: t.date,
        amountPaise: -t.amount, // reverse the effect of a deleted transaction
      }))
    );

    const [deleted] = await prisma.$transaction([
      prisma.transactions.deleteMany({ where: { id: { in: ids } } }),
      ...buildBalanceUpdates(deltas),
    ]);
    deleteResponse = deleted;
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
