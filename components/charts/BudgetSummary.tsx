"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosService } from "@/services";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { useAccountStore } from "@/hooks/useAccountsHook";
import { Loader2 } from "lucide-react";

interface ChartDataItem {
  category: string;
  budget: number;
  actual: number;
}

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function BudgetSummary() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading, Categories } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  const fetchData = async () => {
    try {
      setChartDataLoading(true);
      const tzOffset = -new Date().getTimezoneOffset();
      const { status, data, message } =
        await axiosService.getBudgetVsActualChart({ tzOffset });
      if (!status) throw new Error(message);
      setChartData(data ?? []);
    } catch (error) {
      console.error(error);
      setChartData([]);
    } finally {
      setChartDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, currentAccount, Categories]);

  const totals = useMemo(() => {
    const budget = chartData.reduce((s, i) => s + i.budget, 0);
    const spent = chartData.reduce((s, i) => s + i.actual, 0);
    const overCount = chartData.filter((i) => i.actual > i.budget).length;
    const remaining = budget - spent;
    const usedPct = budget > 0 ? (spent / budget) * 100 : 0;
    return { budget, spent, overCount, remaining, usedPct };
  }, [chartData]);

  const isOver = totals.remaining < 0;
  const spentColor = isOver ? "#f43f5e" : "#2563eb";
  const donut = [
    { name: "spent", value: Math.min(totals.spent, totals.budget) },
    { name: "remaining", value: Math.max(totals.remaining, 0) },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="border-b py-5">
        <CardTitle>Budget Summary</CardTitle>
        <CardDescription>Overall budget usage this month</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-6 sm:px-6">
        {charDataLoading ? (
          <div className="flex h-[220px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[220px] w-full items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              Set a budget on a category to see a summary here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Donut with centered label */}
            <div className="relative h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={84}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    <Cell fill={spentColor} />
                    <Cell fill="rgba(148,163,184,0.22)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-3xl font-bold tracking-tight ${
                    isOver ? "text-rose-500" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {Math.round(totals.usedPct)}%
                </span>
                <span className="text-xs text-muted-foreground">used</span>
              </div>
            </div>

            {/* Summary stats */}
            <dl className="mt-6 w-full space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total budget</dt>
                <dd className="font-medium">{inr(totals.budget)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Spent</dt>
                <dd className="font-medium">{inr(totals.spent)}</dd>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <dt className="text-muted-foreground">
                  {isOver ? "Over budget" : "Remaining"}
                </dt>
                <dd
                  className={`font-semibold ${
                    isOver ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {inr(Math.abs(totals.remaining))}
                </dd>
              </div>
              {totals.overCount > 0 && (
                <p className="pt-1 text-xs text-rose-500">
                  {totals.overCount}{" "}
                  {totals.overCount === 1 ? "category is" : "categories are"} over
                  budget
                </p>
              )}
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
