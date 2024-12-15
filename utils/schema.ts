import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Name should have atleast 3 char").trim(),
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
});
export const signinSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
});
export const accountSchema = z.object({
  name: z.string().min(3, "Account Name should have atleast 3 char").trim(),
});
export const categorySchema = z.object({
  name: z.string().min(3, "Category Name should have atleast 3 char").trim(),
});
