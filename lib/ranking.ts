import { prisma } from "@/lib/db/client";
import { Category } from "@prisma/client";
import { clampScore, invertNormalize, normalizeValue } from "@/lib/utils";
import { PUBG_TIER_VALUES, type PubgTier } from "@/lib/constants";

// ─── Score Calculators ───────────────────────────────────────────────────────

export function computeFitnessScore(stat: {
  benchPressMax?: number | null;
  squatMax?: number | null;
  deadliftMax?: number | null;
  bodyweightKg?: number | null;
  consistencyStreak?: number | null;
  totalVolumeKg?: number | null;
  isVerified?: boolean;
}): number {
  const bw = stat.bodyweightKg ?? 70;
  const bench = stat.benchPressMax ?? 0;
  const squat = stat.squatMax ?? 0;
  const deadlift = stat.deadliftMax ?? 0;

  const strengthTotal = bench + squat + deadlift;
  const strengthPerBW = bw > 0 ? strengthTotal / bw : 0;
  // Normalize: world-class lifter ~10x BW total → cap at 12
  const strengthScore = normalizeValue(strengthPerBW, 0, 12) * 600;

  const streak = stat.consistencyStreak ?? 0;
  // Cap streak at 365 days
  const streakScore = normalizeValue(streak, 0, 365) * 200;

  const volume = stat.totalVolumeKg ?? 0;
  // Cap volume at 500,000 kg (serious lifter over time)
  const volumeScore = normalizeValue(volume, 0, 500_000) * 200;

  let total = strengthScore + streakScore + volumeScore;

  if (stat.isVerified) total += 50;

  return clampScore(total);
}

export function computePubgScore(stat: {
  kdRatio?: number | null;
  totalWins?: number | null;
  totalMatches?: number | null;
  rankTier?: string | null;
  avgDamage?: number | null;
}): number {
  const kd = stat.kdRatio ?? 0;
  const wins = stat.totalWins ?? 0;
  const matches = stat.totalMatches ?? 1;
  const winRate = matches > 0 ? wins / matches : 0;
  const tier = stat.rankTier
    ? (PUBG_TIER_VALUES[stat.rankTier as PubgTier] ?? 1)
    : 1;
  const damage = stat.avgDamage ?? 0;

  // KD ratio: world-class is ~8-10 KD → cap at 10
  const kdScore = normalizeValue(kd, 0, 10) * 400;

  // Win rate: cap at 50% (very high in battle royale)
  const winScore = normalizeValue(winRate, 0, 0.5) * 250;

  // Tier: 1–8 scale
  const tierScore = normalizeValue(tier, 1, 8) * 200;

  // Damage: cap at 800 avg damage
  const damageScore = normalizeValue(damage, 0, 800) * 150;

  return clampScore(kdScore + winScore + tierScore + damageScore);
}

export function computeChessScore(stat: {
  chessRating?: number | null;
  winRate?: number | null;
  tournamentPlacements?: number | null;
}): number {
  const rating = stat.chessRating ?? 0;
  const wr = stat.winRate ?? 0;
  const tournaments = stat.tournamentPlacements ?? 0;

  // Rating / 30 capped at 1000 → cap at 3000
  const ratingScore = normalizeValue(rating, 0, 3000) * 700;

  // Win rate: 0–100%
  const wrScore = normalizeValue(wr / 100, 0, 1) * 200;

  // Tournaments: cap at 50 placements
  const tourneyScore = normalizeValue(tournaments, 0, 50) * 100;

  return clampScore(ratingScore + wrScore + tourneyScore);
}

export function computeSpeedScore(stat: {
  reactionTimeMs?: number | null;
  tappingSpeed?: number | null;
  sprintTimeSec?: number | null;
}): number {
  const reaction = stat.reactionTimeMs ?? 999;
  const tapping = stat.tappingSpeed ?? 0;
  const sprint = stat.sprintTimeSec ?? 60;

  // Reaction: lower is better. Elite ~150ms, avg ~250ms, cap range 100–500ms
  const reactionScore = invertNormalize(reaction, 100, 500) * 400;

  // Tapping: higher is better. Elite ~14 taps/sec. Cap at 15.
  const tappingScore = normalizeValue(tapping, 0, 15) * 300;

  // Sprint 100m: lower is better. Elite 10s, avg 15s, cap range 9–20s
  const sprintScore = invertNormalize(sprint, 9, 20) * 300;

  return clampScore(reactionScore + tappingScore + sprintScore);
}

export function computeScore(
  category: Category,
  stat: Record<string, unknown>
): number {
  switch (category) {
    case "FITNESS":
      return computeFitnessScore(stat as Parameters<typeof computeFitnessScore>[0]);
    case "PUBG":
      return computePubgScore(stat as Parameters<typeof computePubgScore>[0]);
    case "CHESS":
      return computeChessScore(stat as Parameters<typeof computeChessScore>[0]);
    case "SPEED":
      return computeSpeedScore(stat as Parameters<typeof computeSpeedScore>[0]);
    default:
      return 0;
  }
}

// ─── Rank Assignment ─────────────────────────────────────────────────────────

interface RankedStat {
  id: string;
  userId: string;
  rankScore: number;
  user: {
    city: string | null;
    province: string | null;
    gender: string;
    ageGroup: string;
  };
}

function assignRanks(
  stats: RankedStat[]
): Map<string, { national: number; province: number; city: number; gender: number; ageGroup: number }> {
  const sorted = [...stats].sort((a, b) => b.rankScore - a.rankScore);

  const rankMap = new Map<string, { national: number; province: number; city: number; gender: number; ageGroup: number }>();

  // National ranks
  sorted.forEach((s, i) => {
    rankMap.set(s.id, { national: i + 1, province: 0, city: 0, gender: 0, ageGroup: 0 });
  });

  // Province ranks
  const byProvince = new Map<string, RankedStat[]>();
  sorted.forEach((s) => {
    const prov = s.user.province ?? "Unknown";
    if (!byProvince.has(prov)) byProvince.set(prov, []);
    byProvince.get(prov)!.push(s);
  });
  byProvince.forEach((group) => {
    group.forEach((s, i) => {
      rankMap.get(s.id)!.province = i + 1;
    });
  });

  // City ranks
  const byCity = new Map<string, RankedStat[]>();
  sorted.forEach((s) => {
    const city = s.user.city ?? "Unknown";
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city)!.push(s);
  });
  byCity.forEach((group) => {
    group.forEach((s, i) => {
      rankMap.get(s.id)!.city = i + 1;
    });
  });

  // Gender ranks
  const byGender = new Map<string, RankedStat[]>();
  sorted.forEach((s) => {
    const g = s.user.gender;
    if (!byGender.has(g)) byGender.set(g, []);
    byGender.get(g)!.push(s);
  });
  byGender.forEach((group) => {
    group.forEach((s, i) => {
      rankMap.get(s.id)!.gender = i + 1;
    });
  });

  // Age group ranks
  const byAge = new Map<string, RankedStat[]>();
  sorted.forEach((s) => {
    const age = s.user.ageGroup;
    if (!byAge.has(age)) byAge.set(age, []);
    byAge.get(age)!.push(s);
  });
  byAge.forEach((group) => {
    group.forEach((s, i) => {
      rankMap.get(s.id)!.ageGroup = i + 1;
    });
  });

  return rankMap;
}

// ─── Main Ranking Computation ────────────────────────────────────────────────

export async function computeRankings(category: Category): Promise<void> {
  const stats = await prisma.categoryStat.findMany({
    where: { category },
    include: {
      user: {
        select: { city: true, province: true, gender: true, ageGroup: true },
      },
    },
  });

  // Recompute scores
  const updatedStats = stats.map((s) => ({
    ...s,
    rankScore: computeScore(category, s),
  }));

  const rankMap = assignRanks(updatedStats);

  // Bulk update via transaction
  await prisma.$transaction(
    updatedStats.map((s) => {
      const ranks = rankMap.get(s.id)!;
      return prisma.categoryStat.update({
        where: { id: s.id },
        data: {
          rankScore: s.rankScore,
          nationalRank: ranks.national,
          provinceRank: ranks.province,
          cityRank: ranks.city,
          genderRank: ranks.gender,
          ageGroupRank: ranks.ageGroup,
        },
      });
    })
  );
}

export async function computeAllRankings(): Promise<void> {
  await Promise.all([
    computeRankings("FITNESS"),
    computeRankings("PUBG"),
    computeRankings("CHESS"),
    computeRankings("SPEED"),
  ]);
}
