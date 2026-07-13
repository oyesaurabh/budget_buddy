"use client";

import { FiArrowDownLeft, FiArrowUpRight, FiPieChart } from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const trend = [
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
  { day: "31", value: 74 },
];

const budgets = [
  { name: "Home", spent: 45000, budget: 50000, tone: "ok" as const },
  { name: "Food", spent: 12400, budget: 15000, tone: "ok" as const },
  { name: "Gym", spent: 6800, budget: 6000, tone: "over" as const },
];

const metrics = [
  {
    label: "Balance",
    value: "₹1,24,320",
    change: "+₹8,240",
    tone: "positive" as const,
    icon: FiPieChart,
  },
  {
    label: "Income",
    value: "₹56,365",
    change: "+₹560",
    tone: "positive" as const,
    icon: FiArrowDownLeft,
  },
  {
    label: "Expenses",
    value: "₹71,300",
    change: "−₹2,410",
    tone: "negative" as const,
    icon: FiArrowUpRight,
  },
];

export default function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/40">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60">
        <span className="size-3 rounded-full bg-rose-400/80" />
        <span className="size-3 rounded-full bg-amber-400/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
        <div className="ml-3 hidden flex-1 items-center rounded-md bg-white px-3 py-1 text-xs text-slate-400 dark:bg-white/5 sm:flex">
          budgetbuddy.app/dashboard
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-200 p-4 dark:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${
                      metric.tone === "positive"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {metric.value}
                </p>
                <p
                  className={`mt-1 text-xs font-medium ${
                    metric.tone === "positive"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {metric.change} this month
                </p>
              </div>
            );
          })}
        </div>

        {/* Cash-flow chart + budget tracker */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Cash flow
              </p>
              <span className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400">
                This month
              </span>
            </div>
            <div className="mt-4 h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trend}
                  margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="previewFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2f78ff" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2f78ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2f78ff"
                    strokeWidth={2.5}
                    fill="url(#previewFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Budget vs actual
            </p>
            <ul className="mt-4 space-y-3.5">
              {budgets.map((b) => {
                const pct = Math.min((b.spent / b.budget) * 100, 100);
                const over = b.tone === "over";
                return (
                  <li key={b.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">
                        {b.name}
                      </span>
                      <span
                        className={
                          over
                            ? "font-medium text-rose-500"
                            : "font-medium text-slate-900 dark:text-white"
                        }
                      >
                        ₹{b.spent.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          over ? "bg-rose-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
