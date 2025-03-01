"use client";
import { useEffect, useState } from "react";
import { DataCards } from "./data-cards";
import { BsPiggyBankFill } from "react-icons/bs";
import { axiosService } from "@/services";
import { useAccountStore } from "@/hooks/useAccountsHook";

export default function DataGrid() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentAccount } = useAccountStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosService.getDataGrid({
          account_id: currentAccount,
        });
        if (!response.status) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-2 mb-8">
      <DataCards
        title="Remainig Balance"
        dateRange={new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
        Icon={BsPiggyBankFill}
        isLoading={isLoading}
      />
      <DataCards
        title="Total Revenue"
        Icon={BsPiggyBankFill}
        isLoading={isLoading}
      />
      <DataCards
        title="Total Revenue"
        Icon={BsPiggyBankFill}
        isLoading={isLoading}
      />
      <DataCards
        title="Total Revenue"
        Icon={BsPiggyBankFill}
        isLoading={isLoading}
      />
    </div>
  );
}
