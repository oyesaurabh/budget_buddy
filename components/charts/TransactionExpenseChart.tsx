"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
import { CiSearch } from "react-icons/ci";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { axiosService } from "@/services";

const chartConfig = {
  Debit: {
    label: "Debit",
    color: "#f43f5e",
  },
  Credit: {
    label: "Credit",
    color: "#22c55e",
  },
};
const timeRangeConfig = [
  {
    key: "current",
    value: "Current Month",
  },
  {
    key: "1m",
    value: "Last 1 Month",
  },
  {
    key: "3m",
    value: "Last 3 Month",
  },
  {
    key: "6m",
    value: "Last 6 Month",
  },
];
interface ChartDataItem {
  date: string;
  Debit: number;
  Credit: number;
}
export default function AreaVariant() {
  const [timeRange, setTimeRange] = useState("1m");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { Categories, isLoading } = useCategoryStore();

  const fetchData = async (payload: any) => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getTransactionExpenseChart(payload);
      if (!status) throw new Error(message);

      prepareChartData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setChartDataLoading(false);
    }
  };
  useEffect(() => {
    if (isLoading) return;

    const defaultCategoryId = Categories[0]?.id;
    setCategoryId(defaultCategoryId);
    const payload = {
      categoryId: defaultCategoryId,
      timeRange,
    };
    fetchData(payload);
  }, [isLoading]);

  const handleSearch = async () => {
    try {
      const payload = {
        categoryId,
        timeRange,
      };
      fetchData(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const prepareChartData = async (data: any) => {
    const groupedData = data?.reduce((acc: any, item: any) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const amount = item.amount;

      if (!acc[date]) {
        acc[date] = { date, Debit: 0, Credit: 0 };
      }

      if (amount < 0) {
        acc[date].Debit += Math.abs(amount);
      } else {
        acc[date].Credit += amount;
      }

      return acc;
    }, {});

    const filteredData = Object.values(groupedData).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setChartData(filteredData as ChartDataItem[]);
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Transaction Expense Chart</CardTitle>
          <CardDescription>Showing transaction expense chart.</CardDescription>
        </div>

        {isLoading ? (
          <>
            <div className="w-[160px] h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-[160px] h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-[160px] rounded-lg sm:ml-auto">
                <SelectValue placeholder="Select Daterange..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {timeRangeConfig?.map((item) => (
                  <SelectItem
                    value={item.key}
                    className="rounded-lg"
                    key={item.key}
                  >
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              defaultValue={Categories[0]?.id}
            >
              <SelectTrigger className="w-full md:w-[160px] rounded-lg sm:ml-auto">
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

            <Button
              variant="secondary"
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
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {charDataLoading ? (
          <div className="h-[250px] w-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            {/* Simplified shimmer chart */}
            <div className="w-full h-full relative">
              {/* Grid lines */}
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
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="Credit"
                  type="monotone"
                  fill="#22c55e"
                  stroke="var(--color-Credit)"
                  stackId="a"
                />
                <Area
                  dataKey="Debit"
                  type="monotone"
                  fill="#f43f5e"
                  stroke="var(--color-Debit)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
