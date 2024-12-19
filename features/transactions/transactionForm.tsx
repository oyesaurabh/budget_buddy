import { Loader2, TrashIcon } from "lucide-react";
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
import { transactionSchema } from "@/utils/schema";
import { z } from "zod";

type Props = {
  id?: string | any;
  defaultValues?: z.input<typeof transactionSchema>;
  onSubmit: (values: z.input<typeof transactionSchema>) => void;
  onDelete?: () => void;
  disabled?: boolean;
};
export default function AccountForm({
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
  const handleSubmit = (values: z.infer<typeof transactionSchema>) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Name</FormLabel>
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
        <Button type="submit" disabled={disabled} className="w-full">
          {disabled ? (
            <Loader2 className="animate-spin" />
          ) : id != "" ? (
            "Save Changes"
          ) : (
            "Create Transaction"
          )}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant={"outline"}
          >
            <TrashIcon />
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
}
