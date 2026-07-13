import { IconType } from "react-icons";
import { format } from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "./ui/card";
import { formatCurrency } from "@/utils/math";
import { cn } from "@/lib/utils";

type Accent = "emerald" | "rose" | "blue" | "amber";

const accentStyles: Record<Accent, string> = {
  emerald: "bg-emerald-500/10 text-emerald-500",
  rose: "bg-rose-500/10 text-rose-500",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
};

type props = {
  title: string;
  dateRange?: string;
  value?: number;
  // Previous period value used for the comparison (misnamed historically)
  percentageChange?: number;
  Icon: IconType;
  accent?: Accent;
  isLoading?: boolean;
};

export const DataCards = ({
  title,
  dateRange,
  value = 0,
  percentageChange,
  Icon,
  accent = "blue",
  isLoading,
}: props) => {
  if (isLoading) {
    return (
      <Card className="border border-border/60 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="size-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    );
  }

  const previous = percentageChange;
  const hasPrevious =
    previous !== undefined && previous !== null && previous !== 0;
  // Higher value is "better" for every card here (expenses/spending are stored
  // negative, so a higher value means you spent less).
  const delta = hasPrevious ? value - previous : 0;
  const isBetter = delta > 0;
  const isSame = delta === 0;
  const pct = hasPrevious
    ? Math.abs((delta / Math.abs(previous)) * 100)
    : 0;

  const defaultRange = `${format(new Date().setDate(1), "dd MMM")} - ${format(
    new Date(),
    "dd MMM, yyyy"
  )}`;

  return (
    <Card className="group relative overflow-hidden border border-border/60 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/70">
            {dateRange || defaultRange}
          </p>
        </div>
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            accentStyles[accent]
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <h2 className="mt-4 truncate text-2xl font-bold tracking-tight sm:text-3xl">
        {formatCurrency(value)}
      </h2>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {hasPrevious && !isSame ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              isBetter
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {isBetter ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {pct.toFixed(1)}%
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
            —
          </span>
        )}
        <span className="text-muted-foreground">
          vs last month{" "}
          {hasPrevious ? (
            <span className="text-foreground/70">
              {formatCurrency(previous)}
            </span>
          ) : null}
        </span>
      </div>
    </Card>
  );
};
