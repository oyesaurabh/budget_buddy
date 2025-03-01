"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDatePickerStore } from "@/stores/useDatepickerStore";
import { PopoverClose } from "@radix-ui/react-popover";

function DatePickerWithRange({ fetchTransactions }: any) {
  const { dateRange, setDateRange, resetDateRange } = useDatePickerStore();

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
            aria-label="Select a date range"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
          <div className="w-full flex items-center bg-gray-300 dark:bg-gray-800 gap-4 p-2">
            <PopoverClose asChild>
              <Button
                className="w-full"
                variant="outline"
                size="sm"
                onClick={resetDateRange}
                disabled={!dateRange?.from || !dateRange?.to}
              >
                Reset
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                className="w-full"
                disabled={!dateRange?.from || !dateRange?.to}
                size="sm"
                onClick={fetchTransactions}
              >
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerWithRange;
