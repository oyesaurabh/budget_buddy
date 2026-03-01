import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const getAvgVsCurrentChart = async (request: NextRequest) => {
  try {
    // Get logged-in user from header
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionHeader);

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(startOfCurrentMonth);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get current month totals (only expenses - positive amounts)
    const currentMonth = await prisma.transactions.groupBy({
      by: ["category_id"],
      where: {
        account: { user_id: userId },
        date: { gte: startOfCurrentMonth, lte: now },
        amount: { gt: 0 }, // Only expenses
      },
      _sum: { amount: true },
    });

    // Get past 6 months totals (excluding current month, only expenses)
    const pastSixMonths = await prisma.transactions.groupBy({
      by: ["category_id"],
      where: {
        account: { user_id: userId },
        date: { gte: sixMonthsAgo, lt: startOfCurrentMonth },
        amount: { gt: 0 }, // Only expenses
      },
      _sum: { amount: true },
    });

    // Fetch category names for mapping
    const categories = await prisma.categories.findMany({
      where: { account: { user_id: userId } },
      select: { id: true, name: true },
    });

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    // Convert past 6 months total into average
    const pastSixAvg = pastSixMonths.map((item) => ({
      category_id: item.category_id,
      avg: Math.round((item._sum.amount ?? 0) / 6), // Keep in paise, round to avoid decimals
    }));

    // Get all category IDs that have transactions (current or past)
    const activeCategoryIds = new Set([
      ...currentMonth.map((item) => item.category_id),
      ...pastSixMonths.map((item) => item.category_id),
    ]);

    // Handle uncategorized transactions (category_id is null)
    const hasUncategorized = activeCategoryIds.has(null);
    if (hasUncategorized) {
      activeCategoryIds.delete(null);
    }

    // Merge into final chartData format - only include categories with transactions
    const chartData = [];

    // Add categorized transactions
    activeCategoryIds.forEach((categoryId) => {
      const categoryName = categoryMap[categoryId ?? ""];
      if (categoryName) {
        const avgItem = pastSixAvg.find((a) => a.category_id === categoryId);
        const currentItem = currentMonth.find(
          (c) => c.category_id === categoryId
        );

        chartData.push({
          category: categoryName,
          avg: Math.round((avgItem?.avg ?? 0) / 100), // Convert to rupees
          current: Math.round((currentItem?._sum.amount ?? 0) / 100), // Convert to rupees
        });
      }
    });

    // Add uncategorized transactions if they exist
    if (hasUncategorized) {
      const avgItem = pastSixAvg.find((a) => a.category_id === null);
      const currentItem = currentMonth.find((c) => c.category_id === null);

      chartData.push({
        category: "Uncategorized",
        avg: Math.round((avgItem?.avg ?? 0) / 100),
        current: Math.round((currentItem?._sum.amount ?? 0) / 100),
      });
    }

    // Sort by total spending (avg + current) in descending order
    chartData.sort((a, b) => b.avg + b.current - (a.avg + a.current));

    return NextResponse.json({ data: chartData, status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while fetching transactions" },
      { status: 500 }
    );
  }
};

export const GET = withErrorHandling(getAvgVsCurrentChart);
