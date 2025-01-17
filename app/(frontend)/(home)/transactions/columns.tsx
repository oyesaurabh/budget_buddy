"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useNewTransaction } from "@/hooks/useTransactionHook";
import { convertTimestamp } from "@/utils/math";

export type responseType = {
  id: string;
  name: string;
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
        key={row.original.id}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      return <span>{row.original.category_name ?? "-"}</span>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      return (
        <span>
          {row.original.date ? convertTimestamp(row.original.date) : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const celldata = row.original.amount;
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
    accessorKey: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "cheque_no",
    header: () => <span>Cheque No</span>,
    cell: ({ row }: any) => <span>{row.original.cheque_no ?? "-"}</span>,
  },
  {
    accessorKey: "notes",
    header: () => {
      return <span>Notes</span>;
    },
    cell: ({ row }: any) => {
      return (
        <div className="relative group" title={row.original.notes}>
          <span className="block w-40 truncate">{row.original.notes}</span>
        </div>
      );
    },
  },

  {
    id: "action",
    header: () => {
      return <span>Edit</span>;
    },
    cell: ({ row }) => {
      const { setValues, onOpen } = useNewTransaction();
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
