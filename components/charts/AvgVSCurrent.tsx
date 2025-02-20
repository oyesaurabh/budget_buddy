"use client";

import { TrendingUp } from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Mock data for average vs current spending
const chartData = [
  { category: "Food", avg: 12000, current: 18000 },
  { category: "Travel", avg: 8000, current: 7000 },
  { category: "Entertainment", avg: 5000, current: 6000 },
  { category: "Utilities", avg: 3000, current: 3500 },
];

// Chart configuration for avg vs current
const chartConfig = {
  avg: {
    label: "Average",
    color: "hsl(var(--chart-1))", // Purple for average
  },
  current: {
    label: "Current",
    color: "hsl(var(--chart-2))", // Green for current
  },
} satisfies ChartConfig;

export default function AvgVSCurrent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Average vs Current Spending</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
            height={300} // Set a fixed height or make it dynamic
            width={500}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
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
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Spending increased by 12% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing average vs current spending for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
