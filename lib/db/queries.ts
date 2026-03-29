import { prisma } from "@/lib/db/client";
import { Category, Role, SubmissionStatus } from "@prisma/client";

// ─── User Queries ─────────────────────────────────────────────────────────────

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      stats: true,
      _count: { select: { followers: true, following: true } },
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      stats: true,
      _count: { select: { followers: true, following: true } },
    },
  });
}

export async function getUserBySupabaseId(supabaseId: string) {
  return prisma.user.findUnique({ where: { supabaseId } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// ─── Leaderboard Queries ──────────────────────────────────────────────────────

export interface LeaderboardFilters {
  category: Category;
  province?: string;
  city?: string;
  gender?: string;
  ageGroup?: string;
  scope?: "national" | "province" | "city";
  search?: string;
  page?: number;
  perPage?: number;
}

export async function getLeaderboard(filters: LeaderboardFilters) {
  const { category, province, city, gender, ageGroup, search, page = 1, perPage = 25 } = filters;
  const skip = (page - 1) * perPage;

  const where = {
    category,
    user: {
      isBanned: false,
      ...(province ? { province } : {}),
      ...(city ? { city } : {}),
      ...(gender ? { gender: gender as "MALE" | "FEMALE" | "OTHER" } : {}),
      ...(ageGroup ? { ageGroup: ageGroup as "UNDER_18" | "AGE_18_24" | "AGE_25_34" | "OVER_34" } : {}),
      ...(search
        ? {
            OR: [
              { username: { contains: search, mode: "insensitive" as const } },
              { displayName: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
  };

  const [stats, total] = await Promise.all([
    prisma.categoryStat.findMany({
      where,
      orderBy: { rankScore: "desc" },
      skip,
      take: perPage,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            city: true,
            province: true,
            isVerified: true,
            isPremium: true,
            gender: true,
            ageGroup: true,
          },
        },
      },
    }),
    prisma.categoryStat.count({ where }),
  ]);

  return { stats, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

// ─── Public Figure Queries ────────────────────────────────────────────────────

export async function getPublicFigures(filters?: {
  province?: string;
  officeLevel?: string;
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const { province, officeLevel, search, page = 1, perPage = 20 } = filters ?? {};
  const skip = (page - 1) * perPage;

  const where = {
    isActive: true,
    ...(province ? { province } : {}),
    ...(officeLevel ? { officeLevel: officeLevel as "LOCAL" | "MUNICIPAL" | "DISTRICT" | "PROVINCIAL" | "NATIONAL" } : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [figures, total] = await Promise.all([
    prisma.publicFigure.findMany({
      where,
      orderBy: [{ isPromoted: "desc" }, { approvalScore: "desc" }],
      skip,
      take: perPage,
    }),
    prisma.publicFigure.count({ where }),
  ]);

  return { figures, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function getPublicFigureById(id: string) {
  return prisma.publicFigure.findUnique({
    where: { id },
    include: { _count: { select: { votes: true } } },
  });
}

// ─── Challenge Queries ────────────────────────────────────────────────────────

export async function getActiveChallenges() {
  return prisma.challenge.findMany({
    where: { status: "ACTIVE" },
    orderBy: { endDate: "asc" },
    include: { _count: { select: { entries: true } } },
  });
}

export async function getChallengeById(id: string) {
  return prisma.challenge.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { score: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              username: true,
              displayName: true,
              avatarUrl: true,
              city: true,
            },
          },
        },
      },
      _count: { select: { entries: true } },
    },
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export async function getPendingSubmissions(page = 1, perPage = 20) {
  const skip = (page - 1) * perPage;
  const [entries, total] = await Promise.all([
    prisma.statEntry.findMany({
      where: { status: SubmissionStatus.PENDING },
      orderBy: { createdAt: "asc" },
      skip,
      take: perPage,
      include: {
        user: {
          select: { username: true, displayName: true, email: true },
        },
      },
    }),
    prisma.statEntry.count({ where: { status: SubmissionStatus.PENDING } }),
  ]);
  return { entries, total, page, perPage };
}

export async function getAdminStats() {
  const [totalUsers, pendingSubmissions, totalFigures, openReports] =
    await Promise.all([
      prisma.user.count({ where: { isBanned: false } }),
      prisma.statEntry.count({ where: { status: SubmissionStatus.PENDING } }),
      prisma.publicFigure.count({ where: { isActive: true } }),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);
  return { totalUsers, pendingSubmissions, totalFigures, openReports };
}

export async function getAllUsers(
  page = 1,
  perPage = 20,
  search?: string,
  role?: Role
) {
  const skip = (page - 1) * perPage;
  const where = {
    ...(search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { displayName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        isVerified: true,
        isBanned: true,
        isPremium: true,
        createdAt: true,
        city: true,
        province: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, perPage };
}

// ─── Explore Queries ──────────────────────────────────────────────────────────

export async function getTrendingUsers(city?: string, limit = 10) {
  const stats = await prisma.categoryStat.findMany({
    where: city ? { user: { city, isBanned: false } } : { user: { isBanned: false } },
    orderBy: { rankScore: "desc" },
    take: limit,
    distinct: ["userId"],
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          city: true,
          province: true,
          isVerified: true,
          isPremium: true,
        },
      },
    },
  });
  return stats;
}

export async function getTopByCity(city: string, limit = 5) {
  return prisma.categoryStat.findMany({
    where: { user: { city, isBanned: false } },
    orderBy: { rankScore: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          avatarUrl: true,
          city: true,
        },
      },
    },
  });
}

// ─── Notification Queries ─────────────────────────────────────────────────────

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
