"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { adminActionClient } from "@/lib/actions/index";
import { leaderCreateSchema } from "@/lib/validations/leader";
import { computeAllRankings } from "@/lib/ranking";
import { revalidatePath } from "next/cache";

export const reviewSubmissionAction = adminActionClient
  .schema(
    z.object({
      entryId: z.string(),
      status: z.enum(["APPROVED", "REJECTED"]),
      adminNotes: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    const entry = await prisma.statEntry.findUnique({
      where: { id: parsedInput.entryId },
    });

    if (!entry) throw new Error("Submission not found");

    await prisma.statEntry.update({
      where: { id: parsedInput.entryId },
      data: {
        status: parsedInput.status,
        reviewedBy: dbUser.id,
        reviewedAt: new Date(),
      },
    });

    if (parsedInput.status === "APPROVED") {
      // Mark the CategoryStat as verified
      await prisma.categoryStat.updateMany({
        where: { userId: entry.userId, category: entry.category },
        data: { isVerified: true },
      });

      // Recompute rankings for this category
      await computeAllRankings();
    }

    await prisma.adminAction.create({
      data: {
        adminId: dbUser.id,
        actionType: "REVIEW_SUBMISSION",
        targetType: "STAT_ENTRY",
        targetId: parsedInput.entryId,
        notes: parsedInput.adminNotes,
      },
    });

    revalidatePath("/admin/submissions");
    return { success: true };
  });

export const banUserAction = adminActionClient
  .schema(
    z.object({
      userId: z.string(),
      banned: z.boolean(),
      reason: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    await prisma.user.update({
      where: { id: parsedInput.userId },
      data: { isBanned: parsedInput.banned },
    });

    await prisma.adminAction.create({
      data: {
        adminId: dbUser.id,
        actionType: parsedInput.banned ? "BAN_USER" : "UNBAN_USER",
        targetType: "USER",
        targetId: parsedInput.userId,
        notes: parsedInput.reason,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  });

export const verifyUserAction = adminActionClient
  .schema(z.object({ userId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    await prisma.user.update({
      where: { id: parsedInput.userId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        role: "VERIFIED_MEMBER",
      },
    });

    await prisma.adminAction.create({
      data: {
        adminId: dbUser.id,
        actionType: "VERIFY_USER",
        targetType: "USER",
        targetId: parsedInput.userId,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  });

export const createLeaderAction = adminActionClient
  .schema(leaderCreateSchema)
  .action(async ({ parsedInput }) => {
    const figure = await prisma.publicFigure.create({
      data: {
        name: parsedInput.name,
        office: parsedInput.office,
        officeLevel: parsedInput.officeLevel as "LOCAL" | "MUNICIPAL" | "DISTRICT" | "PROVINCIAL" | "NATIONAL",
        region: parsedInput.region,
        province: parsedInput.province,
        party: parsedInput.party,
        description: parsedInput.description,
        photoUrl: parsedInput.photoUrl,
      },
    });

    revalidatePath("/leaders");
    revalidatePath("/admin/leaders");
    return { success: true, id: figure.id };
  });

export const resolveReportAction = adminActionClient
  .schema(
    z.object({
      reportId: z.string(),
      status: z.enum(["REVIEWED", "RESOLVED"]),
      adminNotes: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { dbUser } = ctx;

    await prisma.report.update({
      where: { id: parsedInput.reportId },
      data: {
        status: parsedInput.status,
        adminNotes: parsedInput.adminNotes,
      },
    });

    await prisma.adminAction.create({
      data: {
        adminId: dbUser.id,
        actionType: "RESOLVE_REPORT",
        targetType: "REPORT",
        targetId: parsedInput.reportId,
        notes: parsedInput.adminNotes,
      },
    });

    revalidatePath("/admin/reports");
    return { success: true };
  });

export const recomputeRankingsAction = adminActionClient
  .schema(z.object({}))
  .action(async () => {
    await computeAllRankings();
    revalidatePath("/leaderboard");
    return { success: true };
  });
