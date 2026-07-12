"use client";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
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
import { CiSearch } from "react-icons/ci";

const chartConfig = {
  total: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const monthConfig = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month) => ({
  key: month.slice(0, 3).toLowerCase(),
  value: month,
}));

// Last 5 years, current first
const yearConfig = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { key: String(year), value: String(year) };
});

interface ChartDataItem {
  category: string;
  total: number;
}

export default function MonthlyExpense() {
  const [month, setMonth] = useState<string>("jan");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  const fetchData = async (payload: any) => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getMonthlyExpenseChart(payload);
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
    const now = new Date();
    const currentMonth = now
      .toLocaleString("en-US", { month: "short" })
      .toLowerCase();
    const currentYear = String(now.getFullYear());
    setMonth(currentMonth);
    setYear(currentYear);
    fetchData({ month: currentMonth, year: currentYear });
  }, [isLoading, currentAccount]);

  const handleSearch = async () => {
    try {
      fetchData({ month, year });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Expense Distribution by Category</CardTitle>
          <CardDescription>
            Showing categorywise expenses for the month
          </CardDescription>
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
          <Select value={month} onValueChange={setMonth} disabled={isLoading}>
            <SelectTrigger
              className="w-full md:w-[130px] rounded-lg sm:ml-auto"
              aria-label="Select a month"
            >
              <SelectValue placeholder="Select Month..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {monthConfig.map((item) => (
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
          <Select value={year} onValueChange={setYear} disabled={isLoading}>
            <SelectTrigger
              className="w-full md:w-[100px] rounded-lg sm:ml-auto"
              aria-label="Select a year"
            >
              <SelectValue placeholder="Select Year..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {yearConfig.map((item) => (
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
          <Button
            variant={"secondary"}
            disabled={isLoading || charDataLoading}
            onClick={handleSearch}
          >
            {charDataLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <CiSearch />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {charDataLoading ? (
          <div className="h-[250px] w-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-full h-full relative">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-gray-200 dark:bg-gray-700"
                  style={{ top: `${25 * (i + 1)}%` }}
                ></div>
              ))}
            </div>
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
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => String(value).slice(0, 6)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={60}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `₹${value}`}
                    />
                  }
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={8} />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
