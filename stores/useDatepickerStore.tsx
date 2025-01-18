import { create } from "zustand";
import { DateRange } from "react-day-picker";

type DatePickerStore = {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  getFormattedRange: () => { from: string; to: string } | null;
};

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    from: thirtyDaysAgo,
    to: today,
  };
};

// Get stored date range from localStorage
const getStoredDateRange = (): DateRange | undefined => {
  const stored = localStorage.getItem("dateRange");
  if (!stored) return undefined;

  try {
    const parsed = JSON.parse(stored);
    return {
      from: new Date(parsed.from),
      to: new Date(parsed.to),
    };
  } catch (error) {
    console.error("Error parsing stored date range:", error);
    return undefined;
  }
};

export const useDatePickerStore = create<DatePickerStore>((set, get) => ({
  // Initialize with stored date range or default if none exists
  dateRange: getStoredDateRange() || getDefaultDateRange(),

  setDateRange: (range) => {
    // Store in localStorage when updating
    if (range) {
      localStorage.setItem(
        "dateRange",
        JSON.stringify({
          from: range.from,
          to: range.to,
        })
      );
    } else {
      localStorage.removeItem("dateRange");
    }
    set({ dateRange: range });
  },

  getFormattedRange: () => {
    const { dateRange } = get();
    if (!dateRange?.from || !dateRange?.to) return null;

    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    };
  },
}));
