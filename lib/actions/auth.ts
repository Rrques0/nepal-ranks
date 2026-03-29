"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { actionClient } from "@/lib/actions/index";
import { redirect } from "next/navigation";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/dashboard");
  });

export const signupAction = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    // Check username availability
    const existingUser = await prisma.user.findUnique({
      where: { username: parsedInput.username },
    });

    if (existingUser) {
      throw new Error("Username is already taken");
    }

    const { data, error } = await supabase.auth.signUp({
      email: parsedInput.email,
      password: parsedInput.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Failed to create account");
    }

    // Create Prisma user record
    await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email: parsedInput.email,
        username: parsedInput.username,
        displayName: parsedInput.displayName,
        gender: parsedInput.gender as "MALE" | "FEMALE" | "OTHER",
        ageGroup: parsedInput.ageGroup as "UNDER_18" | "AGE_18_24" | "AGE_25_34" | "OVER_34",
        province: parsedInput.province,
        city: parsedInput.city,
        profileType: parsedInput.profileType as
          | "ATHLETE"
          | "GAMER"
          | "CHESS_PLAYER"
          | "PUBLIC_FIGURE"
          | "INFLUENCER"
          | "DEFAULT",
        role: "MEMBER",
      },
    });

    redirect("/dashboard");
  });

export const logoutAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  });
