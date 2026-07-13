"use client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";
import { axiosService } from "@/services";
import { signinSchema } from "@/utils";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    setLoading(true);
    try {
      const response = await axiosService.signin(values);
      const { status, message, data } = response ?? {};
      if (!status) throw new Error(message);

      const { name, email } = data;
      localStorage.setItem("username", name);
      localStorage.setItem("useremail", email);

      toast.success(message || "Login Successful");
      router.push("/dashboard");
      router.prefetch("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-9 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="group h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Sign in
              <FiArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
