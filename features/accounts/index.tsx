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
import { axiosService } from "@/services";
import { toast } from "sonner";
import { useState } from "react";

type formValues = z.input<typeof accountSchema>;

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const [isDisabled, setIsDisabled] = useState(false);

  const onSubmit = async (values: formValues) => {
    setIsDisabled(true);
    try {
      const response = await axiosService.createNewAccount(values);
      const { status, message } = response ?? {};
      if (!status) throw new Error(message);

      toast.success(message ?? "Account Created");
      onClose();
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
          disabled={isDisabled}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
export default NewAccountSheet;
