import DataGrid from "@/components/data-grid";
import DataCharts from "@/components/data-charts";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
      <h2 className="font-mono italic text-gray-500 text-lg font-light tracking-wide text-center mt-8 mb-4">
        more charts coming soon...
      </h2>
    </div>
  );
}
