"use client";
import { useNewAccount } from "@/hooks/useNewAccount";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "./accountForm";
import { accountSchema } from "@/utils/schema";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useAccountStore } from "@/hooks/useAccountsHook";
type formValues = z.input<typeof accountSchema>;

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const { createAccount } = useAccountStore();

  const onSubmit = async (values: formValues) => {
    setIsDisabled(true);
    try {
      const success = await createAccount(values);
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

  const onDelete = () => {
    setIsDisabled(true);
    try {
      // Add delete logic
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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a New Account to track your transaction
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          onDelete={onDelete}
          disabled={isDisabled}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
export default NewAccountSheet;
