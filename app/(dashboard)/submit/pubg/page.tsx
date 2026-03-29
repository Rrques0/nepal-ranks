import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PubgForm } from "@/components/submit/PubgForm";

export const metadata = { title: "Submit PUBG Stats" };

export default async function SubmitPubgPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Submit PUBG Stats</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Upload a screenshot of your PUBG stats to get verified faster.</p>
      </div>
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <PubgForm />
      </div>
    </div>
  );
}
