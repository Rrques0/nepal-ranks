"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
}

export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
