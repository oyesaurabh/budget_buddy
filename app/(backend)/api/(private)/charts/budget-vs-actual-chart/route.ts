import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const MS_PER_MINUTE = 60 * 1000;

const getBudgetVsActualChart = async (request: NextRequest) => {
  try {
    // Get logged-in user from header
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionHeader);

    const body = await request.json().catch(() => ({}));
    // Minutes to add to a UTC instant to get the user's local time (IST = +330)
    const tzOffset = Number.isFinite(Number(body?.tzOffset))
      ? Number(body.tzOffset)
      : 0;

    // Only categories that have a monthly budget set
    const budgetedCategories = await prisma.categories.findMany({
      where: {
        account: { user_id: userId },
        monthly_budget: { not: null },
      },
      select: { id: true, name: true, monthly_budget: true },
    });

    if (budgetedCategories.length === 0) {
      return NextResponse.json({ data: [], status: true });
    }

    // Current month window in the user's timezone (as real UTC instants)
    const nowLocal = new Date(Date.now() + tzOffset * MS_PER_MINUTE);
    const startOfMonth = new Date(
      Date.UTC(nowLocal.getUTCFullYear(), nowLocal.getUTCMonth(), 1) -
        tzOffset * MS_PER_MINUTE
    );

    // Actual spend (expenses stored as negative) per budgeted category this month
    const spends = await prisma.transactions.groupBy({
      by: ["category_id"],
      where: {
        category_id: { in: budgetedCategories.map((c) => c.id) },
        date: { gte: startOfMonth, lte: new Date() },
        amount: { lt: 0 },
      },
      _sum: { amount: true },
    });

    const spentByCategory = Object.fromEntries(
      spends.map((s) => [s.category_id, Math.abs(s._sum.amount ?? 0)])
    );

    const chartData = budgetedCategories
      .map((c) => ({
        category: c.name,
        budget: Math.round((c.monthly_budget ?? 0) / 100), // paise -> rupees
        actual: Math.round((spentByCategory[c.id] ?? 0) / 100),
      }))
      // Highest spenders first
      .sort((a, b) => b.actual - a.actual);

    return NextResponse.json({ data: chartData, status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while fetching budget data" },
      { status: 500 }
    );
  }
};

export const POST = withErrorHandling(getBudgetVsActualChart);
