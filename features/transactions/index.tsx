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
import {
  useTransactionStore,
  useNewTransaction,
} from "@/hooks/useTransactionHook";
type formValues = z.input<typeof transactionSchema>;

const NewTransactionSheet = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { createTransaction } = useTransactionStore();
  const { isOpen, onClose, values } = useNewTransaction();

  const onSubmit = async (v: formValues) => {
    setIsDisabled(true);
    try {
      // let success = false;
      const success = await createTransaction(v);
      // if (!!values) success = await editAccount({ ...values, name: v.name });
      // else success = await createAccount(v);
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

  const onDelete = async () => {
    setIsDisabled(true);
    try {
      // const success = await deleteAccounts([values.id]);
      // if (success) onClose();
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
      console.error(error);
    } finally {
      setIsDisabled(false);
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
