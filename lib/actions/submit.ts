"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { authActionClient } from "@/lib/actions/index";
import { fitnessSchema } from "@/lib/validations/fitness";
import { pubgSchema } from "@/lib/validations/pubg";
import { chessSchema } from "@/lib/validations/chess";
import { speedSchema } from "@/lib/validations/speed";
import { computeScore } from "@/lib/ranking";
import { revalidatePath } from "next/cache";

const withProof = z.object({ proofUrl: z.string().url().optional().nullable() });

export const submitFitnessAction = authActionClient
  .schema(fitnessSchema.merge(withProof))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const stat = await prisma.categoryStat.upsert({
      where: { userId_category: { userId: dbUser.id, category: "FITNESS" } },
      update: {
        benchPressMax: parsedInput.benchPressMax,
        squatMax: parsedInput.squatMax,
        deadliftMax: parsedInput.deadliftMax,
        overheadPressMax: parsedInput.overheadPressMax,
        pullUpsMax: parsedInput.pullUpsMax,
        pushUpsMax: parsedInput.pushUpsMax,
        bodyweightKg: parsedInput.bodyweightKg,
        consistencyStreak: parsedInput.consistencyStreak,
        totalVolumeKg: parsedInput.totalVolumeKg,
        proofUrl: parsedInput.proofUrl,
        lastUpdated: new Date(),
      },
      create: {
        userId: dbUser.id,
        category: "FITNESS",
        benchPressMax: parsedInput.benchPressMax,
        squatMax: parsedInput.squatMax,
        deadliftMax: parsedInput.deadliftMax,
        overheadPressMax: parsedInput.overheadPressMax,
        pullUpsMax: parsedInput.pullUpsMax,
        pushUpsMax: parsedInput.pushUpsMax,
        bodyweightKg: parsedInput.bodyweightKg,
        consistencyStreak: parsedInput.consistencyStreak,
        totalVolumeKg: parsedInput.totalVolumeKg,
        proofUrl: parsedInput.proofUrl,
      },
    });

    // Recompute score
    const score = computeScore("FITNESS", stat);
    await prisma.categoryStat.update({
      where: { id: stat.id },
      data: { rankScore: score },
    });

    // Log stat entry for admin review
    await prisma.statEntry.create({
      data: {
        userId: dbUser.id,
        category: "FITNESS",
        field: "full_submission",
        value: JSON.stringify(parsedInput),
        proofUrl: parsedInput.proofUrl,
        notes: parsedInput.notes,
        status: "PENDING",
      },
    });

    revalidatePath("/leaderboard/fitness");
    revalidatePath("/dashboard");
    return { success: true };
  });

export const submitPubgAction = authActionClient
  .schema(pubgSchema.merge(withProof))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const stat = await prisma.categoryStat.upsert({
      where: { userId_category: { userId: dbUser.id, category: "PUBG" } },
      update: {
        kdRatio: parsedInput.kdRatio,
        rankTier: parsedInput.rankTier,
        totalWins: parsedInput.totalWins,
        top10Rate: parsedInput.top10Rate,
        avgDamage: parsedInput.avgDamage,
        headshotPct: parsedInput.headshotPct,
        totalMatches: parsedInput.totalMatches,
        soloKd: parsedInput.soloKd,
        duoKd: parsedInput.duoKd,
        squadKd: parsedInput.squadKd,
        currentSeason: parsedInput.currentSeason,
        proofUrl: parsedInput.proofUrl,
        lastUpdated: new Date(),
      },
      create: {
        userId: dbUser.id,
        category: "PUBG",
        kdRatio: parsedInput.kdRatio,
        rankTier: parsedInput.rankTier,
        totalWins: parsedInput.totalWins,
        top10Rate: parsedInput.top10Rate,
        avgDamage: parsedInput.avgDamage,
        headshotPct: parsedInput.headshotPct,
        totalMatches: parsedInput.totalMatches,
        soloKd: parsedInput.soloKd,
        duoKd: parsedInput.duoKd,
        squadKd: parsedInput.squadKd,
        currentSeason: parsedInput.currentSeason,
        proofUrl: parsedInput.proofUrl,
      },
    });

    const score = computeScore("PUBG", stat);
    await prisma.categoryStat.update({
      where: { id: stat.id },
      data: { rankScore: score },
    });

    await prisma.statEntry.create({
      data: {
        userId: dbUser.id,
        category: "PUBG",
        field: "full_submission",
        value: JSON.stringify(parsedInput),
        proofUrl: parsedInput.proofUrl,
        notes: parsedInput.notes,
        status: "PENDING",
      },
    });

    revalidatePath("/leaderboard/pubg");
    revalidatePath("/dashboard");
    return { success: true };
  });

export const submitChessAction = authActionClient
  .schema(chessSchema.merge(withProof))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const stat = await prisma.categoryStat.upsert({
      where: { userId_category: { userId: dbUser.id, category: "CHESS" } },
      update: {
        chessRating: parsedInput.chessRating,
        chessUsername: parsedInput.chessUsername,
        winRate: parsedInput.winRate,
        winStreak: parsedInput.winStreak,
        totalGames: parsedInput.totalGames,
        tournamentPlacements: parsedInput.tournamentPlacements,
        proofUrl: parsedInput.proofUrl,
        lastUpdated: new Date(),
      },
      create: {
        userId: dbUser.id,
        category: "CHESS",
        chessRating: parsedInput.chessRating,
        chessUsername: parsedInput.chessUsername,
        winRate: parsedInput.winRate,
        winStreak: parsedInput.winStreak,
        totalGames: parsedInput.totalGames,
        tournamentPlacements: parsedInput.tournamentPlacements,
        proofUrl: parsedInput.proofUrl,
      },
    });

    const score = computeScore("CHESS", stat);
    await prisma.categoryStat.update({
      where: { id: stat.id },
      data: { rankScore: score },
    });

    await prisma.statEntry.create({
      data: {
        userId: dbUser.id,
        category: "CHESS",
        field: "full_submission",
        value: JSON.stringify(parsedInput),
        proofUrl: parsedInput.proofUrl,
        notes: parsedInput.notes,
        status: "PENDING",
      },
    });

    revalidatePath("/leaderboard/chess");
    revalidatePath("/dashboard");
    return { success: true };
  });

export const submitSpeedAction = authActionClient
  .schema(speedSchema.merge(withProof))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const stat = await prisma.categoryStat.upsert({
      where: { userId_category: { userId: dbUser.id, category: "SPEED" } },
      update: {
        sprintTimeSec: parsedInput.sprintTimeSec,
        reactionTimeMs: parsedInput.reactionTimeMs,
        tappingSpeed: parsedInput.tappingSpeed,
        challengeCompletions: parsedInput.challengeCompletions,
        bestReactionMs: parsedInput.bestReactionMs,
        proofUrl: parsedInput.proofUrl,
        lastUpdated: new Date(),
      },
      create: {
        userId: dbUser.id,
        category: "SPEED",
        sprintTimeSec: parsedInput.sprintTimeSec,
        reactionTimeMs: parsedInput.reactionTimeMs,
        tappingSpeed: parsedInput.tappingSpeed,
        challengeCompletions: parsedInput.challengeCompletions,
        bestReactionMs: parsedInput.bestReactionMs,
        proofUrl: parsedInput.proofUrl,
      },
    });

    const score = computeScore("SPEED", stat);
    await prisma.categoryStat.update({
      where: { id: stat.id },
      data: { rankScore: score },
    });

    await prisma.statEntry.create({
      data: {
        userId: dbUser.id,
        category: "SPEED",
        field: "full_submission",
        value: JSON.stringify(parsedInput),
        proofUrl: parsedInput.proofUrl,
        notes: parsedInput.notes,
        status: "PENDING",
      },
    });

    revalidatePath("/leaderboard/speed");
    revalidatePath("/dashboard");
    return { success: true };
  });
