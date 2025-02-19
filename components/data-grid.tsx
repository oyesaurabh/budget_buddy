"use client";
import { DataCards } from "./data-cards";
import { BsPiggyBankFill } from "react-icons/bs";

export default function DataGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCards
        title="Remainig Balance"
        dateRange={new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
        Icon={BsPiggyBankFill}
      />
      <DataCards title="Total Revenue" Icon={BsPiggyBankFill} />
      <DataCards title="Total Revenue" Icon={BsPiggyBankFill} />
    </div>
  );
}
