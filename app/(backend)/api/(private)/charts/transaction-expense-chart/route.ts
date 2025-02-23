import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const getTransactionExpenseChart = async (request: NextRequest) => {
  const body = await request.json();
  const { categoryId, timeRange } = body;
  if (!categoryId || !timeRange) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Calculate the start date based on the timeRange
  const currentDate = new Date();
  let startDate;

  switch (timeRange) {
    case "current":
      startDate = new Date(currentDate.setDate(1));
      break;
    case "1m":
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      break;
    case "3m":
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
      break;
    case "6m":
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
      break;
    default:
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
  }

  try {
    const data = await prisma.transactions.findMany({
      where: {
        category_id: categoryId,
        date: {
          gte: startDate,
          lte: new Date(),
        },
      },
      select: { date: true, amount: true },
    });

    // Convert amount from paise to rupees
    const formattedData = data.map((transaction) => ({
      ...transaction,
      amount: transaction.amount / 100, // Divide by 100 to convert paise to rupees
    }));

    return NextResponse.json({ data: formattedData, status: true });
  } catch (error) {
    throw new Error("Error while fetching transactions");
  }
};
export const POST = withErrorHandling(getTransactionExpenseChart);
