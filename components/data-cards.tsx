import { IconType } from "react-icons";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatCurrency } from "@/utils/math";

type props = {
  title: string;
  dateRange?: string;
  value?: number;
  percentageChange?: any;
  Icon: IconType;
  isLoading?: boolean;
};
export const DataCards = ({
  title,
  dateRange,
  value,
  percentageChange,
  Icon,
  isLoading,
}: props) => {
  return (
    <Card className="border-none drop-shadow-sm">
      {isLoading ? (
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-2 w-3/4">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="size-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-7 w-1/3 mt-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {dateRange ||
                  `${format(new Date().setDate(1), "dd MMM")} - ${format(
                    new Date(),
                    "dd MMM, yyyy"
                  )}`}
              </CardDescription>
            </div>
            <div className="shrink-0">
              <Icon className="size-8 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            {
              <h1 className="font-bold text-2xl mb-2 line-clamp-1">
                {formatCurrency(value)}
              </h1>
            }
            {percentageChange != undefined ? (
              <p
                className={`${
                  percentageChange > 0
                    ? "text-emerald-500"
                    : percentageChange < 0
                    ? "text-rose-500"
                    : ""
                }`}
              >
                last month: {formatCurrency(percentageChange)}
              </p>
            ) : null}
          </CardContent>
        </>
      )}
    </Card>
  );
};
