"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { axiosService } from "@/services";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { useAccountStore } from "@/hooks/useAccountsHook";
import { Loader2 } from "lucide-react";
import { CiSearch } from "react-icons/ci";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

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

const yearConfig = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { key: String(year), value: String(year) };
});

interface ChartDataItem {
  category: string;
  total: number;
}

export default function CategoryBreakdown() {
  const [month, setMonth] = useState<string>("jan");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.total, 0),
    [chartData]
  );

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

  // Minutes to add to a UTC instant to get local wall-clock time (IST = +330)
  const tzOffset = -new Date().getTimezoneOffset();

  useEffect(() => {
    if (isLoading) return;
    const now = new Date();
    const currentMonth = now
      .toLocaleString("en-US", { month: "short" })
      .toLowerCase();
    const currentYear = String(now.getFullYear());
    setMonth(currentMonth);
    setYear(currentYear);
    fetchData({ month: currentMonth, year: currentYear, tzOffset });
  }, [isLoading, currentAccount]);

  const handleSearch = () => fetchData({ month, year, tzOffset });

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Share of expenses per category</CardDescription>
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
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChartContainer
            config={{}}
            className="aspect-auto h-[250px] w-full"
          >
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500 text-lg">No data available</p>
              </div>
            ) : (
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ChartDataItem;
                      const pct = total
                        ? ((item.total / total) * 100).toFixed(1)
                        : "0";
                      return (
                        <div className="bg-background p-2 border rounded-lg">
                          <p className="font-semibold">{item.category}</p>
                          <p>
                            ₹{item.total.toLocaleString("en-IN")} ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
