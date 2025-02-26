// import { AreaVariant, MonthlyExpense, AvgVSCurrent } from "@/components/charts";
import { AreaVariant } from "@/components/charts";

export default function DataCharts() {
  return (
    <div className="flex flex-col gap-4">
      <AreaVariant />
      <div className="flex flex-row justify-between gap-2">
        {/* <MonthlyExpense /> */}
        {/* <AvgVSCurrent /> */}
      </div>
    </div>
  );
}
