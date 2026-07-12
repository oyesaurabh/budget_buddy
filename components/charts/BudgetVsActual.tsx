"use client";

import { useEffect, useState } from "react";
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

export default function BudgetVsActual() {
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
    // Refetch when categories change (e.g. a budget was edited)
  }, [isLoading, currentAccount, Categories]);

  return (
    <Card className="w-full">
      <CardHeader className="border-b py-5">
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>
          This month&apos;s spending against your category budgets
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-6 sm:px-6">
        {charDataLoading ? (
          <div className="flex h-[220px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[220px] w-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-lg text-gray-500">No budgets set</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Add a monthly budget to a category (while creating or editing it)
              to track it here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {chartData.map((item) => {
              const pct =
                item.budget > 0
                  ? Math.min((item.actual / item.budget) * 100, 100)
                  : 0;
              const over = item.actual > item.budget;
              const remaining = item.budget - item.actual;

              return (
                <div key={item.category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-slate-900 dark:text-white">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground">
                      <span
                        className={
                          over
                            ? "font-semibold text-rose-500"
                            : "font-semibold text-slate-900 dark:text-white"
                        }
                      >
                        {inr(item.actual)}
                      </span>{" "}
                      / {inr(item.budget)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        over ? "bg-rose-500" : "bg-blue-600 dark:bg-blue-500"
                      }`}
                      style={{ width: `${over ? 100 : pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {over ? (
                      <span className="text-rose-500">
                        Over budget by {inr(Math.abs(remaining))}
                      </span>
                    ) : (
                      <>
                        {inr(remaining)} left · {Math.round(pct)}% used
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
