"use client";

import { FiArrowDownRight, FiArrowUpRight, FiCreditCard } from "react-icons/fi";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const chartData = [
  { day: "1", value: 24 },
  { day: "4", value: 42 },
  { day: "7", value: 31 },
  { day: "10", value: 52 },
  { day: "13", value: 46 },
  { day: "16", value: 69 },
  { day: "19", value: 57 },
  { day: "22", value: 76 },
  { day: "25", value: 61 },
  { day: "28", value: 82 },
  { day: "31", value: 70 },
];

const metrics = [
  {
    label: "Total balance",
    value: "$2,432.18",
    change: "+ $320.12",
    note: "vs last month",
    tone: "positive",
    icon: FiCreditCard,
  },
  {
    label: "Income",
    value: "$4,560.00",
    change: "+ $560.00",
    note: "vs last month",
    tone: "positive",
    icon: FiArrowDownRight,
  },
  {
    label: "Expenses",
    value: "$2,127.82",
    change: "− $240.12",
    note: "vs last month",
    tone: "negative",
    icon: FiArrowUpRight,
  },
];

export default function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[1360px] overflow-hidden rounded-[20px] border border-white/10 bg-[#07101c] shadow-2xl shadow-blue-950/30">
      <div className="grid min-h-[286px] grid-cols-1 divide-y divide-white/10 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.4fr] lg:divide-x lg:divide-y-0">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-7 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`grid size-11 place-items-center rounded-xl border ${
                    metric.tone === "positive"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : "border-rose-400/20 bg-rose-400/10 text-rose-400"
                  }`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-400">
                <span
                  className={
                    metric.tone === "positive"
                      ? "font-medium text-emerald-400"
                      : "font-medium text-rose-400"
                  }
                >
                  {metric.change}
                </span>{" "}
                {metric.note}
              </p>
            </div>
          );
        })}

        <div className="min-h-[286px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Spending over time
            </p>
            <span className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">
              This month
            </span>
          </div>
          <div className="mt-8 h-[150px] w-full" aria-label="Monthly spending trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="day" hide />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "12px",
                  }}
                  labelFormatter={(day) => `July ${day}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2f78ff"
                  strokeWidth={3}
                  fill="rgba(37, 99, 235, .18)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#07101c]" />
    </div>
  );
}
