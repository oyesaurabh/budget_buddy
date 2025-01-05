"use client";
import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";
import { Loader2, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";
import { axiosService } from "@/services";
import { useAccountStore } from "@/hooks/useAccountsHook";
import NewTransactionSheet from "@/features/transactions";
import { useNewTransaction } from "@/hooks/useTransactionHook";

const TransactionPage = () => {
  //account options hook
  const {
    accounts,
    isAccountLoading,
    error,
    currentAccount,
    setCurrentAccount,
  } = useAccountStore();
  const { onOpen, setValues } = useNewTransaction();
  const [Transactions, setTransactions] = useState([]);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  useEffect(() => {
    if (!currentAccount?.id) return;
    fetchTransactions({ accountId: currentAccount?.id });
  }, [currentAccount]);

  //this will fetch transactions
  const fetchTransactions = async (payload: any) => {
    try {
      setIsLoadingTransaction(true);
      const { status, data, message } = await axiosService.getTransactions(
        JSON.stringify(payload)
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

  //this will handle account change from select dropdown
  const handleAccountChange = (value: any) => {
    const selectedAccount = accounts.find((acc) => acc.id === value);
    if (selectedAccount) {
      setCurrentAccount(selectedAccount);
    }
  };

  //this will handle transaction delete
  const handleDelete = async (row: any) => {
    const ids = row.map((r: any) => r?.original?.id);
    // await deleteTransactions(ids);
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
      <NewTransactionSheet />
      <div className="max-w-screen-2xl mx-auto -mt-24">
        <Card className="border-none">
          <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Transactions Page</CardTitle>
            <div className="flex gap-x-4 sm:justify-between">
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
              {isAccountLoading ? (
                <Select>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Select>
              ) : (
                <Select
                  disabled={!!error}
                  value={currentAccount?.id || ""}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger className="min-w-[150px]">
                    {currentAccount ? currentAccount.name : "Select an account"}
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransactionPage;
