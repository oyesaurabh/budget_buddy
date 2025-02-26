"use client";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Loader2, PlusIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { axiosService } from "@/services";
import { useAccountStore } from "@/hooks/useAccountsHook";
import NewTransactionSheet from "@/features/transactions";
import { useNewTransaction } from "@/stores/useTransactionStore";

import CSVUpload from "./components/CSVUpload";
import { useDatePickerStore } from "@/stores/useDatepickerStore";
import UseDateRangePicker from "@/components/date-range-picker";

const TransactionPage = () => {
  //hooks
  const { currentAccount } = useAccountStore();
  const { getFormattedRange } = useDatePickerStore();
  const { onOpen, setValues } = useNewTransaction();

  const [Transactions, setTransactions] = useState([]);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [CSVUploadModal, setCSVUploadModal] = useState(false);

  useEffect(() => {
    if (!currentAccount?.id) return;
    fetchTransactions();
  }, [currentAccount]);

  //this will fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoadingTransaction(true);
      const { status, data, message } = await axiosService.getTransactions(
        JSON.stringify({
          accountId: currentAccount?.id,
          ...getFormattedRange(),
        })
      );

      if (!status) {
        toast.error(message ?? "Something went wrong");
        return;
      }
      setTransactions(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoadingTransaction(false);
    }
  };

  //this will handle transaction delete
  const handleDelete = async (row: any) => {
    const ids = row?.map((r: any) => r?.original?.id || r?.id);
    if (!ids || ids.length === 0) {
      toast.error("No IDs provided for deletion.");
      return;
    }
    try {
      const { status, message } = await axiosService.deleteTransactions(ids);
      if (!status) {
        toast.error(message ?? "Something went wrong");
        return;
      }
      toast.success(message ?? "Transactions deleted successfully"); //TODO: show transactions without the deleted ones
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(errorMessage);
    }
  };

  //rendering actual content
  const renderContent = () => {
    if (isLoadingTransaction) {
      return (
        <div className="h-[300px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <DataTable
        columns={columns}
        data={Transactions}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <>
      <NewTransactionSheet
        setTransactions={setTransactions}
        currentAccount={currentAccount}
        onDelete={handleDelete}
      />

      {CSVUploadModal && (
        <CSVUpload open={CSVUploadModal} onOpenChange={setCSVUploadModal} />
      )}
      <div className="max-w-screen-2xl mx-auto -mt-24">
        <Card className="border-none">
          <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Transactions Page</CardTitle>
            <div className="flex gap-x-4 sm:justify-between">
              <Button onClick={() => setCSVUploadModal(true)}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  onOpen();
                  setValues("");
                }}
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New
              </Button>
              <UseDateRangePicker fetchTransactions={fetchTransactions} />
            </div>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransactionPage;
