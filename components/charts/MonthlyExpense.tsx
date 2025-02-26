"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Loader2 } from "lucide-react";
import { CiSearch } from "react-icons/ci";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
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

export default function MonthlyExpense() {
  // const [chartType, setChartType] = useState<string>("bar");
  const [month, setMonth] = useState<string>("jan");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [chartData, setChartData] = useState<any[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { Categories, isLoading } = useCategoryStore();

  const fetchData = async (payload: any) => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getTransactionExpenseChart(payload);
      if (!status) throw new Error(message);

      // prepareChartData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setChartDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    try {
      const defaultCategoryId = Categories[0]?.id;
      setCategoryId(defaultCategoryId);
      const currentMonth = new Date()
        .toLocaleString("en-US", { month: "short" })
        .toLowerCase();
      setMonth(currentMonth);
      fetchData({ month: currentMonth, categoryId: defaultCategoryId });
    } catch (error) {
      console.error("Error setting month:", error);
    }
  }, [isLoading]);

  const handleSearch = async () => {
    try {
      fetchData({ month, categoryId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger
            className="w-[100px] rounded-lg sm:ml-auto"
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
        {isLoading ? (
          <Select>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Select>
        ) : (
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            defaultValue={Categories[0]?.id}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select Category..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {Categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Expense Distribution by Category
        </div>
        <div className="leading-none text-muted-foreground">
          Showing Categorywise expenses for the month
        </div>
      </CardFooter>
    </Card>
  );
}
