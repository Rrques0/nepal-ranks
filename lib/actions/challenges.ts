"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { authActionClient } from "@/lib/actions/index";
import { revalidatePath } from "next/cache";

export const joinChallengeAction = authActionClient
  .schema(z.object({ challengeId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const challenge = await prisma.challenge.findUnique({
      where: { id: parsedInput.challengeId },
    });

    if (!challenge) throw new Error("Challenge not found");
    if (challenge.status !== "ACTIVE") throw new Error("Challenge is not active");

    const existing = await prisma.challengeEntry.findUnique({
      where: {
        challengeId_userId: {
          challengeId: parsedInput.challengeId,
          userId: dbUser.id,
        },
      },
    });

    if (existing) throw new Error("Already joined this challenge");

    if (challenge.entryFeeNPR > 0 && !dbUser.isPremium) {
      throw new Error("This challenge requires a paid entry");
    }

    await prisma.challengeEntry.create({
      data: {
        challengeId: parsedInput.challengeId,
        userId: dbUser.id,
      },
    });

    revalidatePath(`/challenges/${parsedInput.challengeId}`);
    revalidatePath("/challenges");
    return { success: true };
  });

export const submitChallengeScoreAction = authActionClient
  .schema(
    z.object({
      challengeId: z.string(),
      score: z.number().min(0),
      proofUrl: z.string().url().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const entry = await prisma.challengeEntry.findUnique({
      where: {
        challengeId_userId: {
          challengeId: parsedInput.challengeId,
          userId: dbUser.id,
        },
      },
    });

    if (!entry) throw new Error("You have not joined this challenge");

    await prisma.challengeEntry.update({
      where: { id: entry.id },
      data: {
        score: parsedInput.score,
        proofUrl: parsedInput.proofUrl,
      },
    });

    revalidatePath(`/challenges/${parsedInput.challengeId}`);
    return { success: true };
  });
