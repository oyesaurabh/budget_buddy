import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling, validateAccountOwnership } from "@/utils";
import prisma from "@/lib/db";

const getTransactions = async (request: NextRequest) => {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);
  const body = await request.json();
  const { from, to, accountId } = body;

  if (!accountId) {
    return NextResponse.json({
      status: false,
      message: "Invalid Body Params",
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

  // Calculating dates
  const today = new Date();

  // Create default start date (30 days ago)
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(today.getDate() - 30);

  // Set final dates based on input or defaults
  const finalStartDate = from ? new Date(from) : defaultStartDate;
  const finalEndDate = to ? new Date(to) : today;

  // Format dates for SQL query
  const startDate = finalStartDate.toISOString().slice(0, 10);
  const endDate = finalEndDate.toISOString().slice(0, 10);

  // Raw SQL query
  let response;
  try {
    response = await prisma.$queryRaw`
      SELECT 
        t.id, 
        cat.name AS category_name, 
        t.category_id, 
        t.payee, 
        t.amount, 
        t.notes, 
        ac.name AS account_name, 
        t.account_id 
      FROM transactions t 
      JOIN accounts ac ON ac.id = t.account_id
      LEFT JOIN categories cat ON cat.id = t.category_id
      WHERE t.date BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp 
        AND ac.user_id=${userId}
        AND t.account_id = ${accountId}
      ORDER BY t.date DESC
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching transactions");
  }

  return NextResponse.json({
    status: true,
    message: "successful",
    data: response,
  });
};

export const POST = withErrorHandling(getTransactions);
