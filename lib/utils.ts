import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRankColor(rank: number): string {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return "#A0A0A0";
}

export function getRankLabel(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function getTrendIcon(direction: "UP" | "DOWN" | "STABLE"): string {
  if (direction === "UP") return "↑";
  if (direction === "DOWN") return "↓";
  return "→";
}

export function getTrendColor(direction: "UP" | "DOWN" | "STABLE"): string {
  if (direction === "UP") return "text-green-500";
  if (direction === "DOWN") return "text-red-500";
  return "text-gray-400";
}

export function clampScore(score: number): number {
  return Math.min(1000, Math.max(0, score));
}

export function normalizeValue(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

export function invertNormalize(
  value: number,
  min: number,
  max: number
): number {
  return 1 - normalizeValue(value, min, max);
}

export function buildAvatarUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
}

export function buildProofUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/proofs/${path}`;
}

export function getApprovalClass(score: number): string {
  if (score >= 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}
