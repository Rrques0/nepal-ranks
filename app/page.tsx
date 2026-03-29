import Link from "next/link";
import Image from "next/image";
import { Trophy, ArrowRight, ShieldCheck, Zap, TrendingUp, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/db/client";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";
import { CATEGORY_LABELS } from "@/lib/constants";

async function getHomepageData() {
  const [
    fitnessTop3,
    pubgTop3,
    chessTop3,
    speedTop3,
    totalUsers,
    recentEntries,
  ] = await Promise.all([
    prisma.categoryStat.findMany({
      where: { category: "FITNESS" },
      orderBy: { rankScore: "desc" },
      take: 3,
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } } },
    }),
    prisma.categoryStat.findMany({
      where: { category: "PUBG" },
      orderBy: { rankScore: "desc" },
      take: 3,
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } } },
    }),
    prisma.categoryStat.findMany({
      where: { category: "CHESS" },
      orderBy: { rankScore: "desc" },
      take: 3,
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } } },
    }),
    prisma.categoryStat.findMany({
      where: { category: "SPEED" },
      orderBy: { rankScore: "desc" },
      take: 3,
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true, city: true, province: true, isVerified: true, isPremium: true } } },
    }),
    prisma.user.count({ where: { isBanned: false } }),
    prisma.statEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      where: { status: "APPROVED" },
      include: { user: { select: { username: true, displayName: true, city: true } } },
    }),
  ]);

  return { fitnessTop3, pubgTop3, chessTop3, speedTop3, totalUsers, recentEntries };
}

const CATEGORY_SECTIONS = [
  { key: "FITNESS", label: "Top Fitness Athletes", emoji: "💪", color: "from-orange-500/20" },
  { key: "PUBG", label: "Top PUBG Players", emoji: "🎮", color: "from-yellow-500/20" },
  { key: "CHESS", label: "Top Chess Players", emoji: "♟️", color: "from-purple-500/20" },
  { key: "SPEED", label: "Top Speed Athletes", emoji: "⚡", color: "from-blue-500/20" },
] as const;

export default async function HomePage() {
  const { fitnessTop3, pubgTop3, chessTop3, speedTop3, totalUsers, recentEntries } = await getHomepageData();

  const topByCategory = {
    FITNESS: fitnessTop3,
    PUBG: pubgTop3,
    CHESS: chessTop3,
    SPEED: speedTop3,
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#DC143C]/10 via-[#0A0A0A] to-[#0A0A0A]" />
          <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-[#DC143C]/10 blur-[100px]" />
          <div className="absolute top-10 right-1/4 h-48 w-48 rounded-full bg-[#FFD700]/5 blur-[80px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/20 px-4 py-2 mb-6">
                <Trophy className="h-4 w-4 text-[#DC143C]" />
                <span className="text-sm text-[#DC143C] font-medium">Nepal&apos;s #1 Competitive Platform</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 tracking-tight">
                <span className="text-white">NEPAL KO</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #DC143C 0%, #FF6B35 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  LEADERBOARD
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#A0A0A0] mb-8 max-w-xl">
                Prove you&apos;re the best. Compete against athletes, gamers, and chess players across all 7 provinces of Nepal.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button size="xl" className="shadow-lg shadow-[#DC143C]/25">
                    Join Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button size="xl" variant="outline">
                    View Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Counter ──────────────────────────────── */}
        <section className="border-y border-[#2A2A2A] bg-[#0D0D0D]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: totalUsers.toLocaleString(), label: "Competitors", icon: Users },
                { value: "4", label: "Categories", icon: Trophy },
                { value: "7", label: "Provinces", icon: MapPin },
                { value: "20+", label: "Major Cities", icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-6 w-6 text-[#DC143C] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-sm text-[#6B7280]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Achievement Ticker ─────────────────────────── */}
        {recentEntries.length > 0 && (
          <div className="border-b border-[#2A2A2A] bg-[#141414] py-3 overflow-hidden">
            <div className="ticker-wrap">
              <div className="ticker-content">
                {recentEntries.map((e, i) => (
                  <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm text-[#A0A0A0]">
                    <span className="text-[#DC143C]">🏆</span>
                    <span className="font-medium text-white">{e.user.displayName}</span>
                    <span>from {e.user.city ?? "Nepal"} submitted</span>
                    <span className="text-[#DC143C] capitalize">{e.category.toLowerCase()} stats</span>
                    <span className="text-[#2A2A2A]">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Featured Rankings ──────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Top Competitors
            </h2>
            <p className="text-[#A0A0A0]">The best across every category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORY_SECTIONS.map(({ key, label, emoji, color }) => {
              const stats = topByCategory[key];
              return (
                <div
                  key={key}
                  className={`rounded-2xl border border-[#2A2A2A] bg-gradient-to-br ${color} to-[#141414] p-6`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-white text-lg">
                      {emoji} {label}
                    </h3>
                    <Link
                      href={`/leaderboard/${key.toLowerCase()}`}
                      className="text-xs text-[#DC143C] hover:underline flex items-center gap-1"
                    >
                      Full Ranking <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stats.slice(0, 3).map((stat, idx) => (
                      <LeaderboardCard key={stat.id} stat={stat} rank={idx + 1} />
                    ))}
                    {stats.length === 0 && (
                      <div className="col-span-3 text-center py-6">
                        <p className="text-sm text-[#6B7280]">Be the first in {CATEGORY_LABELS[key]}!</p>
                        <Link href={`/submit/${key.toLowerCase()}`}>
                          <Button size="sm" className="mt-3">Submit Stats</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How it works ──────────────────────────────── */}
        <section className="border-t border-[#2A2A2A] bg-[#0D0D0D] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-3">How It Works</h2>
              <p className="text-[#A0A0A0]">Get ranked in 3 simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Create Account", desc: "Sign up free. Choose your categories — Fitness, PUBG, Chess, or Speed.", icon: Users },
                { step: "02", title: "Submit Stats", desc: "Enter your best scores and upload proof. Our team verifies submissions.", icon: ShieldCheck },
                { step: "03", title: "Climb the Ranks", desc: "Get ranked nationally, by province, city, gender, and age group.", icon: TrendingUp },
              ].map((item) => (
                <div key={item.step} className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl font-black text-[#DC143C]/20">{item.step}</div>
                    <item.icon className="h-6 w-6 text-[#DC143C]" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#A0A0A0]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-[#DC143C] to-[#8B0000] p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to prove yourself?
              </h2>
              <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">
                Join thousands of Nepali competitors. Show Nepal who the best really is.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/signup">
                  <Button variant="gold" size="xl" className="shadow-xl">
                    Join Nepal Ranks Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
