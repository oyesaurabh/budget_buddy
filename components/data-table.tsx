"use client";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/useConfirm";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MdClear } from "react-icons/md";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any[];
  filterKey?: string;
  onDelete?: (data: any) => void;
  categorySelection?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  categorySelection = false,
}: DataTableProps<TData, TValue>) {
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to bulk delete."
  );
  const { Categories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filteredData, setFilteredData] = useState<any[]>(data);

  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  useEffect(() => {
    const newData = data.filter(
      (item) => item.categoryId === selectedCategory || !selectedCategory
    );
    setFilteredData(newData);
  }, [selectedCategory]);

  return (
    <div>
      <ConfirmationDialog />
      <div className="flex items-center justify-between pb-2">
        {filterKey && (
          <Input
            placeholder={`Filter ${filterKey}...`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {categorySelection && (
          <div className="flex items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Categories?.map((category) => {
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedCategory && (
              <Button
                variant={"destructive"}
                onClick={() => setSelectedCategory("")}
              >
                <MdClear />
              </Button>
            )}
          </div>
        )}
        <Button
          disabled={!table.getFilteredSelectedRowModel().rows.length}
          variant={"secondary"}
          className="font-normal text-xs ml-2"
          size={"sm"}
          onClick={async () => {
            const ok = await confirm();
            if (!ok) return;
            if (onDelete) {
              onDelete(table.getFilteredSelectedRowModel().rows);
            }
            table.resetRowSelection();
          }}
        >
          <Trash /> Delete ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
