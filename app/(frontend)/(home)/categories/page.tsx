"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

import { useCategoryStore, useNewCategory } from "@/hooks/useCategoryHook";

const AccountPage = () => {
  const { onOpen, setValues } = useNewCategory();
  const { Categories, isLoading, deleteCategories } = useCategoryStore();

  const handleDelete = async (row: any) => {
    const ids = row.map((r: any) => r?.original?.id);
    await deleteCategories(ids);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={Categories}
        filterKey="name"
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24">
      <Card className="border-none">
        <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>Category Page</CardTitle>
          <Button
            onClick={() => {
              onOpen();
              setValues("");
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
