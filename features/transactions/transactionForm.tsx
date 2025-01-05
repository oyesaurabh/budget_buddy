import { Loader2, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { transactionSchema } from "@/utils/schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountStore } from "@/hooks/useAccountsHook";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  id?: string | null;
  defaultValues?: z.input<typeof transactionSchema>;
  onSubmit: (values: z.input<typeof transactionSchema>) => void;
  onDelete?: () => void;
  disabled?: boolean;
};
export default function TransactionForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues,
  });
  const { accounts } = useAccountStore();
  const { Categories } = useCategoryStore();

  const handleSubmit = (values: z.infer<typeof transactionSchema>) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormControl className="flex-1">
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    {defaultValues?.accountId
                      ? accounts.find(
                          (account) => account.id === defaultValues?.accountId
                        )?.name
                      : "Select Account"}
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormControl className="flex-1">
                <Select
                  defaultValue={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    {defaultValues?.categoryId
                      ? Categories.find(
                          (category) => category.id === defaultValues.categoryId
                        )?.name
                      : "Select Category"}
                  </SelectTrigger>
                  <SelectContent>
                    {Categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-24">Payee</FormLabel>
              <FormControl className="flex-1">
                <Input
                  placeholder="Enter payee"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-24">Amount</FormLabel>
              <FormControl className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
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
          ) : id ? (
            "Save Changes"
          ) : (
            "Add Transaction"
          )}
        </Button>

        {id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant={"destructive"}
          >
            <TrashIcon />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
}
