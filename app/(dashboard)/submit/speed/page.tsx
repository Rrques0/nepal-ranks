import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpeedForm } from "@/components/submit/SpeedForm";

export const metadata = { title: "Submit Speed Stats" };

export default async function SubmitSpeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Submit Speed Stats</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Enter your reaction time, tapping speed, and sprint times.</p>
      </div>
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <SpeedForm />
      </div>
    </div>
  );
}
