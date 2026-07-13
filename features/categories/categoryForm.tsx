import { Loader2, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categorySchema } from "@/utils/schema";
import { z } from "zod";

// Local-state numeric input: the displayed text is fully owned by this
// component, so React can never revert a keystroke. Only whole rupees are
// accepted; clearing the field reports `undefined` (no budget).
function BudgetInput({
  value,
  onChange,
  disabled,
}: {
  value?: number;
  onChange: (v: number | undefined) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState(value != null ? String(value) : "");

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="e.g. 5000"
      disabled={disabled}
      value={text}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^0-9]/g, "");
        setText(digits);
        onChange(digits === "" ? undefined : Number(digits));
      }}
    />
  );
}

type Props = {
  id?: string | any;
  defaultValues?: z.input<typeof categorySchema>;
  onSubmit: (values: z.input<typeof categorySchema>) => void;
  onDelete?: () => void;
  disabled?: boolean;
};
export default function CategoryForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  });
  const handleSubmit = (values: z.infer<typeof categorySchema>) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Cash, Bank etc"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="monthly_budget"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget (optional)</FormLabel>
              <FormControl>
                <BudgetInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled} className="w-full">
          {disabled ? (
            <Loader2 className="animate-spin" />
          ) : id != "" ? (
            "Save Changes"
          ) : (
            "Create Category"
          )}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant={"destructive"}
          >
            <TrashIcon />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
}
