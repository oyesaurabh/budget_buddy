"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { axiosService } from "@/services";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { useAccountStore } from "@/hooks/useAccountsHook";

// Chart configuration for avg vs current
const chartConfig = {
  avg: {
    label: "Average",
    color: "hsl(var(--chart-1))", // Average
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))", // Current
  },
} satisfies ChartConfig;

interface ChartDataItem {
  category: string;
  avg: number;
  current: number;
}

export default function AvgVSCurrent() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  const fetchData = async () => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getAvgVsCurrentChart();
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
  }, [isLoading, currentAccount]);

  return (
    <Card className="w-full">
      <CardHeader className="border-b py-5">
        <CardTitle>Average vs Current Spending</CardTitle>
        <CardDescription>
          Showing average vs current spending category-wise for the last 6
          months
        </CardDescription>
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
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => String(value).slice(0, 6)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-2 border rounded-lg">
                          <p className="font-semibold">
                            {payload[0].payload.category}
                          </p>
                          <p>Avg: ₹{payload[0].payload.avg}</p>
                          <p>Current: ₹{payload[0].payload.current}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  dataKey="avg"
                  type="monotone"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="current"
                  type="monotone"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
