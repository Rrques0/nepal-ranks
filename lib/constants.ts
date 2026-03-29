export const PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
] as const;

export type Province = (typeof PROVINCES)[number];

export const CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Biratnagar",
  "Birgunj",
  "Dharan",
  "Butwal",
  "Nepalgunj",
  "Hetauda",
  "Bharatpur",
  "Janakpur",
  "Dhangadhi",
  "Itahari",
  "Ghorahi",
  "Tulsipur",
  "Damak",
  "Inaruwa",
  "Urlabari",
  "Rajbiraj",
] as const;

export type City = (typeof CITIES)[number];

export const PROVINCE_CITIES: Record<Province, string[]> = {
  Koshi: ["Biratnagar", "Dharan", "Itahari", "Damak", "Inaruwa", "Urlabari"],
  Madhesh: ["Birgunj", "Janakpur", "Rajbiraj"],
  Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur", "Hetauda", "Bharatpur"],
  Gandaki: ["Pokhara"],
  Lumbini: ["Butwal", "Ghorahi", "Tulsipur"],
  Karnali: [],
  Sudurpashchim: ["Dhangadhi", "Nepalgunj"],
};

export const CATEGORIES = ["FITNESS", "PUBG", "CHESS", "SPEED"] as const;
export type CategoryType = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  FITNESS: "Fitness",
  PUBG: "PUBG Mobile",
  CHESS: "Chess",
  SPEED: "Speed & Reaction",
};

export const CATEGORY_ICONS: Record<CategoryType, string> = {
  FITNESS: "Dumbbell",
  PUBG: "Crosshair",
  CHESS: "Crown",
  SPEED: "Zap",
};

export const PUBG_RANK_TIERS = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crown",
  "Ace",
  "Conqueror",
] as const;

export type PubgTier = (typeof PUBG_RANK_TIERS)[number];

export const PUBG_TIER_VALUES: Record<PubgTier, number> = {
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Platinum: 4,
  Diamond: 5,
  Crown: 6,
  Ace: 7,
  Conqueror: 8,
};

export const AGE_GROUPS = [
  { value: "UNDER_18", label: "Under 18" },
  { value: "AGE_18_24", label: "18–24" },
  { value: "AGE_25_34", label: "25–34" },
  { value: "OVER_34", label: "35+" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other / Prefer not to say" },
] as const;

export const PROFILE_TYPES = [
  { value: "ATHLETE", label: "Athlete" },
  { value: "GAMER", label: "Gamer" },
  { value: "CHESS_PLAYER", label: "Chess Player" },
  { value: "PUBLIC_FIGURE", label: "Public Figure" },
  { value: "INFLUENCER", label: "Influencer" },
  { value: "DEFAULT", label: "General" },
] as const;

export const RANK_COLORS = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
} as const;

export const PREMIUM_FEATURES = [
  "Verified badge on your profile",
  "Priority placement in leaderboard",
  "Bold name styling",
  "Downloadable rank card image",
  "Early access to new challenges",
  "Advanced stats & analytics",
] as const;

export const PREMIUM_PRICE_NPR = 299;

export const APP_NAME = "Nepal Ranks";
export const APP_TAGLINE = "Nepal Ko Leaderboard";
export const APP_DESCRIPTION =
  "The competitive leaderboard platform for young Nepali athletes, gamers, chess players, and citizens.";
