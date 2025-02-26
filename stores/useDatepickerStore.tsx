import { create } from "zustand";
import { DateRange } from "react-day-picker";

type DatePickerStore = {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  getFormattedRange: () => { from: string; to: string } | null;
  resetDateRange: () => void;
};

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  return {
    from,
    to: today,
  };
};

export const useDatePickerStore = create<DatePickerStore>((set, get) => ({
  dateRange: getDefaultDateRange(),

  setDateRange: (range) => {
    set({ dateRange: range });
  },
  resetDateRange: () => {
    set({ dateRange: getDefaultDateRange() });
  },
  getFormattedRange: () => {
    const { dateRange } = get();
    if (!dateRange?.from || !dateRange?.to) return null;

    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);

    return {
      from: fromDate.toLocaleDateString("en-CA"),
      to: toDate.toLocaleDateString("en-CA"),
    };
  },
}));
