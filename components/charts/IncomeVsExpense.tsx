"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosService } from "@/services";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { useAccountStore } from "@/hooks/useAccountsHook";
import { Loader2 } from "lucide-react";

const chartConfig = {
  income: {
    label: "Income",
    color: "#22c55e",
  },
  expense: {
    label: "Expense",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

const rangeConfig = [
  { key: "6", value: "Last 6 Months" },
  { key: "12", value: "Last 12 Months" },
];

interface ChartDataItem {
  month: string;
  income: number;
  expense: number;
}

export default function IncomeVsExpense() {
  const [months, setMonths] = useState<string>("6");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  const fetchData = async (payload: any) => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getIncomeExpenseChart(payload);
      if (!status) throw new Error(message);

      setChartData(data ?? []);
    } catch (error) {
      console.error(error);
      setChartData([]);
    } finally {
      setChartDataLoading(false);
    }
  };

  // Minutes to add to a UTC instant to get local wall-clock time (IST = +330)
  const tzOffset = -new Date().getTimezoneOffset();

  useEffect(() => {
    if (isLoading) return;
    fetchData({ months: Number(months), tzOffset });
  }, [isLoading, currentAccount]);

  const handleRangeChange = (value: string) => {
    setMonths(value);
    fetchData({ months: Number(value), tzOffset });
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Income vs Expense</CardTitle>
          <CardDescription>
            Monthly income and expense comparison
          </CardDescription>
        </div>

        <Select
          value={months}
          onValueChange={handleRangeChange}
          disabled={isLoading}
        >
          <SelectTrigger
            className="w-full md:w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a range"
          >
            <SelectValue placeholder="Select Range..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {rangeConfig.map((item) => (
              <SelectItem
                key={item.key}
                value={item.key}
                className="rounded-lg"
              >
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {charDataLoading ? (
          <div className="h-[250px] w-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500 text-lg">No data available</p>
              </div>
            ) : (
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={70}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex w-full justify-between gap-4">
                          <span className="capitalize text-muted-foreground">
                            {name}
                          </span>
                          <span className="font-mono font-medium">
                            ₹{Number(value).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
