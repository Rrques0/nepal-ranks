import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FitnessForm } from "@/components/submit/FitnessForm";

export const metadata = { title: "Submit Fitness Stats" };

export default async function SubmitFitnessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Submit Fitness Stats</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">
          Your stats are reviewed and added to the leaderboard. Upload proof to get verified.
        </p>
      </div>
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <FitnessForm />
      </div>
    </div>
  );
}
