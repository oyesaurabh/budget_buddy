import {
  AreaVariant,
  MonthlyExpense,
  AvgVSCurrent,
  IncomeVsExpense,
  CategoryBreakdown,
} from "@/components/charts";

export default function DataCharts() {
  return (
    <div className="flex flex-col gap-4">
      <IncomeVsExpense />
      <AreaVariant />
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <MonthlyExpense />
        <CategoryBreakdown />
      </div>
      <AvgVSCurrent />
    </div>
  );
}
