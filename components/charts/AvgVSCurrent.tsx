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
  { category: "aklsfd", avg: 3000, current: 3500 },
  { category: "sdfsml", avg: 3000, current: 3500 },
  { category: "Utili", avg: 3000, current: 3300 },
  { category: "Utilities", avg: 9000, current: 3400 },
  { category: "Utilities", avg: 1000, current: 3700 },
  { category: "Utilities", avg: 400, current: 300 },
  { category: "Utilities", avg: 350, current: 900 },
  { category: "Utilities", avg: 10, current: 200 },
  { category: "Utilities", avg: 800, current: 300 },
  { category: "Utilities", avg: 300, current: 100 },
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
        <CardDescription>
          Showing average vs current spending category-wise for the last 6
          months
        </CardDescription>
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
            height={100}
            width={300}
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
    </Card>
  );
}
