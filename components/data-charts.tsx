import {
  AreaVariant,
  MonthlyExpense,
  AvgVSCurrent,
  IncomeVsExpense,
  CategoryBreakdown,
  TopPayees,
  BudgetVsActual,
} from "@/components/charts";

export default function DataCharts() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <AreaVariant />
        </div>
        <div className="w-full lg:w-1/3">
          <CategoryBreakdown />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <AvgVSCurrent />
        </div>
        <div className="w-full lg:w-1/3">
          <MonthlyExpense />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <IncomeVsExpense />
        </div>
        <div className="w-full lg:w-1/3">
          <TopPayees />
        </div>
      </div>

      <BudgetVsActual />
    </div>
  );
}
