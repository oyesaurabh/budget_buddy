import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const MS_PER_MINUTE = 60 * 1000;

const getTopPayeesChart = async (request: NextRequest) => {
  try {
    // Get logged-in user from header
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionHeader);

    const body = await request.json().catch(() => ({}));
    const months = Number(body?.months) > 0 ? Number(body.months) : 6;
    const limit = Number(body?.limit) > 0 ? Number(body.limit) : 10;
    // Minutes to add to a UTC instant to get the user's local time (IST = +330)
    const tzOffset = Number.isFinite(Number(body?.tzOffset))
      ? Number(body.tzOffset)
      : 0;

    // Start of the range: first day of (current month - (months - 1)) in user-local time
    const nowLocal = new Date(Date.now() + tzOffset * MS_PER_MINUTE);
    const startDate = new Date(
      Date.UTC(nowLocal.getUTCFullYear(), nowLocal.getUTCMonth() - (months - 1), 1) -
        tzOffset * MS_PER_MINUTE
    );

    // Group expenses (stored as negative) by payee
    const grouped = await prisma.transactions.groupBy({
      by: ["payee"],
      where: {
        account: { user_id: userId },
        date: { gte: startDate },
        amount: { lt: 0 },
      },
      _sum: { amount: true },
    });

    const chartData = grouped
      .map((item) => ({
        payee: item.payee,
        total: Math.round(Math.abs(item._sum.amount ?? 0) / 100), // paise -> rupees
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    return NextResponse.json({ data: chartData, status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while fetching transactions" },
      { status: 500 }
    );
  }
};

export const POST = withErrorHandling(getTopPayeesChart);
