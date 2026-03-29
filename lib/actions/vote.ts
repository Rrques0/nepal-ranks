"use server";

import { prisma } from "@/lib/db/client";
import { voteSchema } from "@/lib/validations/leader";
import { authActionClient } from "@/lib/actions/index";
import { revalidatePath } from "next/cache";

export const voteLeaderAction = authActionClient
  .schema(voteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const figure = await prisma.publicFigure.findUnique({
      where: { id: parsedInput.figureId },
    });

    if (!figure) throw new Error("Leader not found");

    // Upsert vote
    const existingVote = await prisma.publicFigureVote.findUnique({
      where: {
        figureId_userId: {
          figureId: parsedInput.figureId,
          userId: dbUser.id,
        },
      },
    });

    if (existingVote) {
      await prisma.publicFigureVote.update({
        where: { id: existingVote.id },
        data: { rating: parsedInput.rating },
      });
    } else {
      await prisma.publicFigureVote.create({
        data: {
          figureId: parsedInput.figureId,
          userId: dbUser.id,
          rating: parsedInput.rating,
        },
      });
    }

    // Recompute approval score (average of all votes * 20 to get 0-100)
    const allVotes = await prisma.publicFigureVote.findMany({
      where: { figureId: parsedInput.figureId },
    });

    const avg =
      allVotes.reduce((acc, v) => acc + v.rating, 0) / allVotes.length;
    const approvalScore = (avg / 5) * 100;

    const prevScore = figure.approvalScore;
    const trend =
      approvalScore > prevScore
        ? "UP"
        : approvalScore < prevScore
          ? "DOWN"
          : "STABLE";

    await prisma.publicFigure.update({
      where: { id: parsedInput.figureId },
      data: {
        approvalScore,
        totalVotes: allVotes.length,
        trendDirection: trend as "UP" | "DOWN" | "STABLE",
      },
    });

    revalidatePath(`/leaders/${parsedInput.figureId}`);
    revalidatePath("/leaders");
    return { success: true, newScore: approvalScore };
  });
