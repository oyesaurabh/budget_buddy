"use client";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TransactionForm from "./transactionForm";
import { transactionSchema } from "@/utils/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useNewTransaction } from "@/stores/useTransactionStore";
import { axiosService } from "@/services";
import { useAccountStore } from "@/hooks/useAccountsHook";
import { useCategoryStore } from "@/hooks/useCategoryHook";

type formValues = z.input<typeof transactionSchema>;

const NewTransactionSheet = ({
  setTransactions,
  currentAccount,
  onDelete,
}: any) => {
  const { isOpen, onClose, values } = useNewTransaction();
  const { accounts } = useAccountStore();
  const { Categories } = useCategoryStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const onSubmit = async (v: formValues) => {
    try {
      setIsDisabled(true);

      let success = false;
      if (!!values) success = await editTransaction(v);
      else success = await createTransaction(v);

      if (success) {
        if(!!!values) //means creating
           await useAccountStore.getState().fetchAccounts();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  };

  //utils function
  const createTransaction = async (values: any): Promise<boolean> => {
    try {
      const response = await axiosService.createNewTransaction(values);
      const { status, data, message } = response ?? {};

      if (!status) {
        toast.error(message ?? "Failed to create Transaction");
        return false;
      }
      toast.success(message ?? "Transaction Created");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating Transaction";
      toast.error(errorMessage);
      return false;
    }
  };
  const editTransaction = async (values: any): Promise<boolean> => {
    try {
      const response = await axiosService.editTransaction(values);
      const { status, message } = response ?? {};
      if (!status) {
        toast.error(message ?? "Failed to Update");
        return false;
      }

      setTransactions((prev: any) => {
        if (currentAccount?.id !== values.accountId) {
          return prev.filter((transaction: any) => transaction.id !== values.id);
        }

        return prev.map((transaction: any) => {
          if (transaction.id !== values.id) return transaction;

          const accountName = accounts.find(
            (account) => account.id === values.accountId
          )?.name;
          const categoryName = Categories.find(
            (category) => category.id === values.categoryId
          )?.name;

          return {
            ...transaction,
            ...values,
            account_name: accountName ?? transaction.account_name,
            category_name: categoryName ?? null,
          };
        });
      });
      toast.success(message ?? "Transaction Updated");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating Transaction";
      toast.error(errorMessage);
      return false;
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-8">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a New Transaction.</SheetDescription>
        </SheetHeader>
        <TransactionForm
          id={values?.id ?? null}
          onSubmit={onSubmit}
          onDelete={onDelete}
          disabled={isDisabled}
          defaultValues={values}
        />
      </SheetContent>
    </Sheet>
  );
};
export default NewTransactionSheet;
