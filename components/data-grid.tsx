"use client";
import { useSearchParams } from "next/navigation";
import { DataCards } from "./data-cards";
import { BsPiggyBankFill } from "react-icons/bs";

export const DataGrid = () => {
  const params = useSearchParams();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCards
        title="Total Revenue"
        dateRange="Apr 10 - Apr 17, 2025"
        Icon={BsPiggyBankFill}
      />
      <DataCards
        title="Total Revenue"
        dateRange="Apr 10 - Apr 17, 2025"
        Icon={BsPiggyBankFill}
      />
      <DataCards
        title="Total Revenue"
        dateRange="Apr 10 - Apr 17, 2025"
        Icon={BsPiggyBankFill}
      />
    </div>
  );
};
