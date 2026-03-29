import { Check, Star, Zap, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";
import { createCheckoutSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { PREMIUM_FEATURES, PREMIUM_PRICE_NPR } from "@/lib/constants";
import { formatNPR } from "@/lib/utils";

async function startCheckout() {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { prisma } = await import("@/lib/db/client");
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) redirect("/login");

  const url = await createCheckoutSession(dbUser.id, dbUser.email, dbUser.stripeCustomerId);
  redirect(url);
}

export const metadata = { title: "Go Premium" };

const FREE_FEATURES = [
  "Create profile & submit stats",
  "View all leaderboards",
  "Join free challenges",
  "Basic rank display",
  "Follow other competitors",
];

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isPremium = false;
  if (user) {
    const dbUser = await getUserBySupabaseId(user.id);
    isPremium = dbUser?.isPremium ?? false;
  }

  if (isPremium) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/10 mx-auto mb-4">
          <Star className="h-8 w-8 text-[#FFD700]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">You&apos;re Premium!</h1>
        <p className="text-[#A0A0A0]">All premium features are active on your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          Unlock <span style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Premium</span>
        </h1>
        <p className="text-[#A0A0A0] max-w-lg mx-auto">
          Stand out on the leaderboard. Show Nepal you&apos;re serious.
        </p>
      </div>

      {/* Plan comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Free</h3>
            <div className="text-3xl font-black text-white mt-2">NPR 0</div>
            <div className="text-sm text-[#6B7280]">Forever</div>
          </div>
          <ul className="space-y-3 mb-6">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled>Current Plan</Button>
        </div>

        {/* Premium */}
        <div className="rounded-xl border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#FFD700]/10 to-[#141414] p-6 relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="bg-[#FFD700] text-black text-xs font-black px-2.5 py-1 rounded-full">
              POPULAR
            </span>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Premium</h3>
              <Star className="h-4 w-4 text-[#FFD700]" />
            </div>
            <div className="text-3xl font-black text-[#FFD700] mt-2">{formatNPR(PREMIUM_PRICE_NPR)}</div>
            <div className="text-sm text-[#6B7280]">per month</div>
          </div>
          <ul className="space-y-3 mb-6">
            {[...FREE_FEATURES, ...PREMIUM_FEATURES].map((f, i) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className={`h-4 w-4 shrink-0 ${i >= FREE_FEATURES.length ? "text-[#FFD700]" : "text-green-500"}`} />
                <span className={i >= FREE_FEATURES.length ? "text-white font-medium" : "text-[#A0A0A0]"}>{f}</span>
              </li>
            ))}
          </ul>
          <form action={startCheckout}>
            <Button type="submit" variant="gold" className="w-full" size="lg">
              <Zap className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </form>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: "Verified Badge", desc: "Gold verified badge on your profile and in leaderboards" },
          { icon: Trophy, title: "Priority Ranking", desc: "Your name appears highlighted in all ranking views" },
          { icon: Star, title: "Rank Card Download", desc: "Download a shareable image of your rank card to flex on socials" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/10 mx-auto mb-3">
              <item.icon className="h-6 w-6 text-[#FFD700]" />
            </div>
            <h4 className="font-bold text-white mb-1">{item.title}</h4>
            <p className="text-sm text-[#A0A0A0]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
