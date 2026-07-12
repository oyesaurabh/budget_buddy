import DataGrid from "@/components/data-grid";
import DataCharts from "@/components/data-charts";

export default function DashboardPage() {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataCharts />
      <h2 className="mb-4 mt-8 text-center font-mono text-lg font-light italic tracking-wide text-gray-500">
        more charts coming soon...
      </h2>
    </div>
  );
}
