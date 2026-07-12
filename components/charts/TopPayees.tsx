"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
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
  total: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const rangeConfig = [
  { key: "1", value: "This Month" },
  { key: "6", value: "Last 6 Months" },
  { key: "12", value: "Last 12 Months" },
];

interface ChartDataItem {
  payee: string;
  total: number;
}

export default function TopPayees() {
  const [months, setMonths] = useState<string>("6");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [charDataLoading, setChartDataLoading] = useState(false);
  const { isLoading } = useCategoryStore();
  const { currentAccount } = useAccountStore();

  // Minutes to add to a UTC instant to get local wall-clock time (IST = +330)
  const tzOffset = -new Date().getTimezoneOffset();

  const fetchData = async (payload: any) => {
    try {
      setChartDataLoading(true);
      const { status, data, message } =
        await axiosService.getTopPayeesChart(payload);
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
    fetchData({ months: Number(months), tzOffset });
  }, [isLoading, currentAccount]);

  const handleRangeChange = (value: string) => {
    setMonths(value);
    fetchData({ months: Number(value), tzOffset });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Top Payees</CardTitle>
        </div>

        <Select
          value={months}
          onValueChange={handleRangeChange}
          disabled={isLoading}
        >
          <SelectTrigger
            className="w-full md:w-[150px] rounded-lg sm:ml-auto"
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
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 12, right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="payee"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  tickFormatter={(value) =>
                    String(value).length > 12
                      ? `${String(value).slice(0, 12)}…`
                      : String(value)
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />
                  }
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
