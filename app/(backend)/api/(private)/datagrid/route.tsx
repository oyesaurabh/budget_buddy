import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

const getDataGrid = async (request: NextRequest) => {
  const body = await request.json();
  const { account_id } = body;
  if (!account_id) {
    return NextResponse.json({
      error: "Missing required parameters",
      status: false,
    });
  }

  //getting required data from database
  try {
    const currentDate = new Date();
    const preDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    let data;
    try {
      data = await prisma.transactions.findMany({
        where: {
          account_id,
          date: {
            gte: preDate,
            lte: currentDate,
          },
        },
        select: {
          date: true,
          amount: true,
        },
      });
    } catch (error) {
      throw new Error("Error while fetching data");
    }

    const finalObj = {
      total_income: 0,
      total_expenses: 0,
      net_savings: 0,
      avg_daily_spending: 0,
      pre_total_income: 0,
      pre_total_expenses: 0,
      pre_net_savings: 0,
      pre_avg_daily_spending: 0,
    };

    const firstDay = new Date(new Date().setDate(1));
    firstDay.setHours(0, 0, 0, 0);
    data.forEach((item) => {
      if (item?.date >= firstDay) {
        item.amount > 0
          ? (finalObj.total_income += item.amount)
          : (finalObj.total_expenses += item.amount);
      } else {
        item.amount > 0
          ? (finalObj.pre_total_income += item.amount)
          : (finalObj.pre_total_expenses += item.amount);
      }
    });
    finalObj.net_savings = finalObj.total_income + finalObj.total_expenses;
    finalObj.avg_daily_spending =
      finalObj.total_expenses / new Date().getDate();

    finalObj.pre_net_savings =
      finalObj.pre_total_income + finalObj.pre_total_expenses;
    finalObj.pre_avg_daily_spending =
      finalObj.pre_total_expenses /
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

    //converting amount from paise to rupees
    Object.entries(finalObj).forEach(([key, value]) => {
      const typedkey = key as keyof typeof finalObj;
      finalObj[typedkey] = value / 100;
    });

    return NextResponse.json({ data: finalObj, status: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error while fetching data", status: false },
      { status: 500 }
    );
  }
};
export const POST = withErrorHandling(getDataGrid);
