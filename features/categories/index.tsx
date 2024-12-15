"use client";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryForm from "./categoryForm";
import { categorySchema } from "@/utils/schema";
import { toast } from "sonner";
import { useState } from "react";
import { useCategoryStore, useNewCategory } from "@/hooks/useCategoryHook";
type formValues = z.input<typeof categorySchema>;

const NewCategorySheet = () => {
  const { isOpen, onClose, values } = useNewCategory();
  const [isDisabled, setIsDisabled] = useState(false);
  const { createCategory, deleteCategories, editCategory } = useCategoryStore();

  const onSubmit = async (v: formValues) => {
    setIsDisabled(true);
    try {
      let success = false;
      if (!!values) success = await editCategory({ ...values, name: v.name });
      else success = await createCategory(v);
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
      const success = await deleteCategories([values.id]);
      if (success) onClose();
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a New Category to manage your account
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          id={values?.id ?? ""}
          onSubmit={onSubmit}
          onDelete={onDelete}
          disabled={isDisabled}
          defaultValues={{ name: values.name ?? "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
export default NewCategorySheet;
