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
import { useNewTransaction } from "@/hooks/useTransactionHook";
import { axiosService } from "@/services";

type formValues = z.input<typeof transactionSchema>;

const NewTransactionSheet = ({
  setTransactions,
  currentAccount,
  onDelete,
}: any) => {
  const { isOpen, onClose, values } = useNewTransaction();
  const [isDisabled, setIsDisabled] = useState(false);

  const onSubmit = async (v: formValues) => {
    try {
      setIsDisabled(true);

      let success = false;
      console.log(v);
      if (!!values) success = await editTransaction(v);
      else success = await createTransaction(v);

      if (success) {
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

      if (currentAccount?.id === data.account_id) {
        // TODO: not showing the newly added transactions in the table (acc. name only)
        const { account_id, category_id, ...rest } = data;
        setTransactions((prev: any) => [
          ...prev,
          { ...rest, accountId: account_id, categoryId: category_id },
        ]);
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

      // TODO: update the transaction in the table with the new changed values
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
