import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const monthNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const getMonthlyExpenseChart = async (request: NextRequest) => {
  try {
    // Get logged-in user from header
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionHeader);

    const body = await request.json();
    const { month, year } = body;

    const monthIndex = monthNames.indexOf(String(month).toLowerCase());
    if (monthIndex === -1) {
      return NextResponse.json(
        { error: "Invalid month" },
        { status: 400 }
      );
    }

    // Resolve year, falling back to the current year when not provided/invalid
    const parsedYear = Number(year);
    const resolvedYear = Number.isInteger(parsedYear)
      ? parsedYear
      : new Date().getFullYear();

    // Minutes to add to a UTC instant to get the user's local time (IST = +330),
    // so the month window matches the user's calendar, not the server's.
    const tzOffset = Number.isFinite(Number(body?.tzOffset))
      ? Number(body.tzOffset)
      : 0;
    const MS_PER_MINUTE = 60 * 1000;

    // Build the selected month's window in the user's timezone (as real UTC instants)
    const startDate = new Date(
      Date.UTC(resolvedYear, monthIndex, 1) - tzOffset * MS_PER_MINUTE
    );
    const endDate = new Date(
      Date.UTC(resolvedYear, monthIndex + 1, 1) - tzOffset * MS_PER_MINUTE - 1
    );

    // Group expenses (positive amounts) by category for the month
    const grouped = await prisma.transactions.groupBy({
      by: ["category_id"],
      where: {
        account: { user_id: userId },
        date: { gte: startDate, lte: endDate },
        amount: { lt: 0 }, // Only expenses (stored as negative)
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

    const chartData = grouped.map((item) => ({
      category: item.category_id
        ? categoryMap[item.category_id] ?? "Uncategorized"
        : "Uncategorized",
      total: Math.round(Math.abs(item._sum.amount ?? 0) / 100), // Convert paise to rupees (expenses stored as negative)
    }));

    // Sort by total spending in descending order
    chartData.sort((a, b) => b.total - a.total);

    return NextResponse.json({ data: chartData, status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while fetching transactions" },
      { status: 500 }
    );
  }
};

export const POST = withErrorHandling(getMonthlyExpenseChart);
