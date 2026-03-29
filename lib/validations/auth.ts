import { z } from "zod";
import { PROVINCES, CITIES, CATEGORIES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be under 50 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  ageGroup: z.enum(["UNDER_18", "AGE_18_24", "AGE_25_34", "OVER_34"]),
  province: z.enum(PROVINCES as [string, ...string[]]),
  city: z.string().min(1, "City is required"),
  profileType: z.enum([
    "ATHLETE",
    "GAMER",
    "CHESS_PLAYER",
    "PUBLIC_FIGURE",
    "INFLUENCER",
    "DEFAULT",
  ]),
  categories: z
    .array(z.enum(CATEGORIES as [string, ...string[]]))
    .min(1, "Select at least one category"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
