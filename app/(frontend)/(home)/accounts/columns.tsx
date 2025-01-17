"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useNewAccount } from "@/hooks/useAccountsHook";

export type responseType = {
  id: string;
  name: string;
  balance: number;
};

export const columns: ColumnDef<responseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const celldata = row.original.balance;

      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(celldata);

      return (
        <span className={`${celldata < 0 ? "text-red-400" : "text-green-400"}`}>
          {formattedAmount}
        </span>
      );
    },
  },
  {
    id: "action",
    header: () => {
      return <span>Edit</span>;
    },
    cell: ({ row }) => {
      const { setValues, onOpen } = useNewAccount();
      return (
        <Button
          variant="ghost"
          className="px-0"
          key={row.original.id}
          onClick={() => {
            setValues(row.original);
            onOpen();
          }}
        >
          <Settings2 />
        </Button>
      );
    },
  },
];
