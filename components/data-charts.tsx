import { AreaVariant, MonthlyExpense, AvgVSCurrent } from "@/components/charts";

export default function DataCharts() {
  const data: any = [];
  return (
    <div className="flex flex-col gap-4">
      <AreaVariant />
      <div className="flex flex-row justify-between h-96 gap-2">
        <MonthlyExpense />
        <AvgVSCurrent />
      </div>
    </div>
  );
}
