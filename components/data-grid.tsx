"use client";
import { useEffect, useState } from "react";
import { DataCards } from "./data-cards";
import { axiosService } from "@/services";

import { useAccountStore } from "@/hooks/useAccountsHook";

import { FiActivity } from "react-icons/fi";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { BsGraphDownArrow } from "react-icons/bs";

export default function DataGrid() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { currentAccount } = useAccountStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosService.getDataGrid({
          account_id: currentAccount?.id,
        });
        const { data, status } = response;
        if (!status) {
          throw new Error("Failed to fetch data");
        }
        setData(data);
      } catch (error) {
        console.error(error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentAccount]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-2 mb-8">
      <DataCards
        title="Total Income"
        value={data.total_income}
        percentageChange={data.pre_total_income}
        Icon={BsGraphUpArrow}
        isLoading={isLoading}
      />
      <DataCards
        title="Total Expenses"
        value={data.total_expenses}
        percentageChange={data.pre_total_expenses}
        Icon={BsGraphDownArrow}
        isLoading={isLoading}
      />
      <DataCards
        title="Net Savings"
        value={data.net_savings}
        percentageChange={data.pre_net_savings}
        Icon={MdOutlineEnergySavingsLeaf}
        isLoading={isLoading}
      />
      <DataCards
        title="Avg Daily Spending"
        value={data.avg_daily_spending}
        percentageChange={data.pre_avg_daily_spending}
        Icon={FiActivity}
        isLoading={isLoading}
      />
    </div>
  );
}
