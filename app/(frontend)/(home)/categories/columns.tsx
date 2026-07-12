"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useNewCategory } from "@/hooks/useCategoryHook";

export type responseType = {
  id: string;
  name: string;
  monthly_budget?: number | null;
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
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "monthly_budget",
    header: () => <span>Monthly Budget</span>,
    cell: ({ row }) => {
      const budget = row.original.monthly_budget;
      return (
        <span>
          {budget != null ? `₹${budget.toLocaleString("en-IN")}` : "—"}
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
      const { setValues, onOpen } = useNewCategory();
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
