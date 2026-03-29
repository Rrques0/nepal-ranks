import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChessForm } from "@/components/submit/ChessForm";

export const metadata = { title: "Submit Chess Stats" };

export default async function SubmitChessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Submit Chess Stats</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Enter your Chess.com username and current rating. Upload a screenshot as proof.</p>
      </div>
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <ChessForm />
      </div>
    </div>
  );
}
