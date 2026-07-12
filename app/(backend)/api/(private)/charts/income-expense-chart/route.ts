import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const MS_PER_MINUTE = 60 * 1000;

const getIncomeExpenseChart = async (request: NextRequest) => {
  try {
    // Get logged-in user from header
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionHeader);

    const body = await request.json().catch(() => ({}));
    const months = Number(body?.months) > 0 ? Number(body.months) : 6;
    // Minutes to add to a UTC instant to get the user's local wall-clock time
    // (e.g. IST = +330). Sent by the client so buckets match what the user sees.
    const tzOffset = Number.isFinite(Number(body?.tzOffset))
      ? Number(body.tzOffset)
      : 0;

    // "Now" in the user's timezone, used to anchor the month range
    const nowLocal = new Date(Date.now() + tzOffset * MS_PER_MINUTE);
    const curYear = nowLocal.getUTCFullYear();
    const curMonth = nowLocal.getUTCMonth();

    // Seed every month in the range (user-local) so gaps render as zero
    const buckets: Record<string, { income: number; expense: number }> = {};
    const order: string[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(curYear, curMonth - i, 1));
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      buckets[key] = { income: 0, expense: 0 };
      order.push(key);
    }

    // Query window as real UTC instants: from the start of the first bucket
    // (user-local) up to now. A one-day buffer keeps edge rows in; JS bucketing
    // below is authoritative and ignores anything outside `order`.
    const [firstYear, firstMonth] = order[0].split("-").map(Number);
    const startDate = new Date(
      Date.UTC(firstYear, firstMonth, 1) - tzOffset * MS_PER_MINUTE - 86400000
    );

    const transactions = await prisma.transactions.findMany({
      where: {
        account: { user_id: userId },
        date: { gte: startDate },
      },
      select: { date: true, amount: true },
    });

    transactions.forEach((t) => {
      // Shift into user-local time, then read the calendar month via getUTC*
      const shifted = new Date(new Date(t.date).getTime() + tzOffset * MS_PER_MINUTE);
      const key = `${shifted.getUTCFullYear()}-${shifted.getUTCMonth()}`;
      if (!buckets[key]) return; // outside the requested range
      if (t.amount > 0) {
        buckets[key].income += t.amount;
      } else {
        buckets[key].expense += Math.abs(t.amount);
      }
    });

    const chartData = order.map((key) => {
      const [year, monthIdx] = key.split("-").map(Number);
      const label = new Date(Date.UTC(year, monthIdx, 1)).toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      });
      return {
        month: label,
        income: Math.round(buckets[key].income / 100), // paise -> rupees
        expense: Math.round(buckets[key].expense / 100),
      };
    });

    return NextResponse.json({ data: chartData, status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while fetching transactions" },
      { status: 500 }
    );
  }
};

export const POST = withErrorHandling(getIncomeExpenseChart);
