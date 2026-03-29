"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { profileUpdateSchema } from "@/lib/validations/profile";
import { authActionClient } from "@/lib/actions/index";
import { revalidatePath } from "next/cache";

export const updateProfileAction = authActionClient
  .schema(profileUpdateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const updated = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...(parsedInput.displayName !== undefined && { displayName: parsedInput.displayName }),
        ...(parsedInput.fullName !== undefined && { fullName: parsedInput.fullName }),
        ...(parsedInput.bio !== undefined && { bio: parsedInput.bio }),
        ...(parsedInput.city !== undefined && { city: parsedInput.city }),
        ...(parsedInput.district !== undefined && { district: parsedInput.district }),
        ...(parsedInput.province !== undefined && { province: parsedInput.province }),
        ...(parsedInput.gender !== undefined && { gender: parsedInput.gender as "MALE" | "FEMALE" | "OTHER" }),
        ...(parsedInput.ageGroup !== undefined && { ageGroup: parsedInput.ageGroup as "UNDER_18" | "AGE_18_24" | "AGE_25_34" | "OVER_34" }),
        ...(parsedInput.profileType !== undefined && {
          profileType: parsedInput.profileType as
            | "ATHLETE"
            | "GAMER"
            | "CHESS_PLAYER"
            | "PUBLIC_FIGURE"
            | "INFLUENCER"
            | "DEFAULT",
        }),
      },
    });

    revalidatePath(`/user/${updated.username}`);
    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return { success: true };
  });

export const updateAvatarAction = authActionClient
  .schema(z.object({ avatarUrl: z.string().url() }))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { avatarUrl: parsedInput.avatarUrl },
    });

    revalidatePath("/profile");
    return { success: true };
  });

export const followUserAction = authActionClient
  .schema(z.object({ targetUserId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    if (dbUser.id === parsedInput.targetUserId) {
      throw new Error("Cannot follow yourself");
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: dbUser.id,
          followingId: parsedInput.targetUserId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: dbUser.id,
            followingId: parsedInput.targetUserId,
          },
        },
      });
      return { following: false };
    } else {
      await prisma.follow.create({
        data: {
          followerId: dbUser.id,
          followingId: parsedInput.targetUserId,
        },
      });
      return { following: true };
    }
  });
