import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DC143C]/10">
        {icon ?? <Trophy className="h-8 w-8 text-[#DC143C]" />}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="mb-6 text-sm text-[#A0A0A0] max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
