import { AlertTriangle } from "lucide-react";

export function LeaderDisclaimer() {
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-yellow-400 text-sm mb-1">Community Opinion Platform</p>
          <p className="text-sm text-[#A0A0A0]">
            All ratings and approval scores in this section reflect <strong className="text-white">community opinion only</strong> and do not constitute official endorsements, polls, or political assessments. Results are not affiliated with any government body, election commission, or political organization.
          </p>
        </div>
      </div>
    </div>
  );
}
