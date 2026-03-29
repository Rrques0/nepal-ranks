import { PrismaClient } from "@prisma/client";
import { computeScore } from "../lib/ranking";

const prisma = new PrismaClient();

const NEPALI_NAMES = [
  { first: "Aarav", last: "Sharma" },
  { first: "Bikash", last: "Thapa" },
  { first: "Chandan", last: "Rai" },
  { first: "Deepika", last: "Magar" },
  { first: "Esha", last: "Gurung" },
  { first: "Farid", last: "Ansari" },
  { first: "Gita", last: "Tamang" },
  { first: "Hari", last: "Bhandari" },
  { first: "Indira", last: "Shrestha" },
  { first: "Jeevan", last: "KC" },
  { first: "Kamala", last: "Adhikari" },
  { first: "Laxman", last: "Karki" },
  { first: "Maya", last: "Pun" },
  { first: "Nabin", last: "Pokhrel" },
  { first: "Ojaswi", last: "Basnet" },
  { first: "Puja", last: "Subedi" },
  { first: "Rajesh", last: "Ghimire" },
  { first: "Sabita", last: "Dahal" },
  { first: "Tej", last: "Lama" },
  { first: "Uma", last: "Bhattarai" },
  { first: "Vishal", last: "Joshi" },
  { first: "Anita", last: "Khadka" },
  { first: "Binod", last: "Dhakal" },
  { first: "Champa", last: "Limbu" },
  { first: "Dipesh", last: "Pandey" },
  { first: "Elisha", last: "Pradhan" },
  { first: "Ganesh", last: "Rawat" },
  { first: "Hira", last: "Bohara" },
  { first: "Ishaan", last: "Neupane" },
  { first: "Jyoti", last: "Chaudhary" },
];

const CITIES_WITH_PROVINCE = [
  { city: "Kathmandu", province: "Bagmati" },
  { city: "Lalitpur", province: "Bagmati" },
  { city: "Bhaktapur", province: "Bagmati" },
  { city: "Pokhara", province: "Gandaki" },
  { city: "Biratnagar", province: "Koshi" },
  { city: "Dharan", province: "Koshi" },
  { city: "Itahari", province: "Koshi" },
  { city: "Birgunj", province: "Madhesh" },
  { city: "Janakpur", province: "Madhesh" },
  { city: "Butwal", province: "Lumbini" },
  { city: "Nepalgunj", province: "Lumbini" },
  { city: "Dhangadhi", province: "Sudurpashchim" },
  { city: "Bharatpur", province: "Bagmati" },
  { city: "Hetauda", province: "Bagmati" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🌱 Seeding Nepal Ranks database...");

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@nepalranks.com" },
    update: {},
    create: {
      supabaseId: "admin-supabase-id-placeholder",
      email: "admin@nepalranks.com",
      username: "nepalranks_admin",
      displayName: "Nepal Ranks Admin",
      fullName: "Admin User",
      gender: "OTHER",
      ageGroup: "AGE_25_34",
      city: "Kathmandu",
      province: "Bagmati",
      role: "ADMIN",
      isVerified: true,
      verifiedAt: new Date(),
    },
  });
  console.log("✓ Admin user created");

  // 30 regular users
  const users = [];
  for (let i = 0; i < 30; i++) {
    const name = NEPALI_NAMES[i];
    const location = pick(CITIES_WITH_PROVINCE);
    const gender = i % 3 === 0 ? "FEMALE" : "MALE";
    const ageGroups = ["UNDER_18", "AGE_18_24", "AGE_25_34", "OVER_34"] as const;

    const user = await prisma.user.upsert({
      where: { email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com` },
      update: {},
      create: {
        supabaseId: `seed-user-${i}-supabase-id`,
        email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`,
        username: `${name.first.toLowerCase()}${name.last.toLowerCase()}${randomInt(1, 99)}`,
        displayName: `${name.first} ${name.last}`,
        fullName: `${name.first} ${name.last}`,
        gender: gender as "MALE" | "FEMALE",
        ageGroup: pick(ageGroups),
        city: location.city,
        province: location.province,
        bio: `Competitive ${i % 4 === 0 ? "athlete" : i % 4 === 1 ? "gamer" : i % 4 === 2 ? "chess player" : "speed enthusiast"} from ${location.city}.`,
        role: "MEMBER",
        isVerified: i < 10,
        verifiedAt: i < 10 ? new Date() : null,
        isPremium: i < 5,
        profileType: (["ATHLETE", "GAMER", "CHESS_PLAYER", "DEFAULT"] as const)[i % 4],
      },
    });
    users.push(user);
  }
  console.log("✓ 30 users created");

  // Create stats for each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const category = (["FITNESS", "PUBG", "CHESS", "SPEED"] as const)[i % 4];

    const statData =
      category === "FITNESS"
        ? {
            benchPressMax: randomFloat(60, 200),
            squatMax: randomFloat(80, 250),
            deadliftMax: randomFloat(100, 280),
            overheadPressMax: randomFloat(40, 120),
            pullUpsMax: randomInt(5, 40),
            pushUpsMax: randomInt(20, 100),
            bodyweightKg: randomFloat(55, 95),
            consistencyStreak: randomInt(7, 200),
            totalVolumeKg: randomFloat(50000, 300000),
          }
        : category === "PUBG"
          ? {
              kdRatio: randomFloat(1, 8),
              rankTier: pick(["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Crown", "Ace", "Conqueror"]),
              totalWins: randomInt(10, 500),
              top10Rate: randomFloat(10, 60),
              avgDamage: randomFloat(150, 600),
              headshotPct: randomFloat(10, 45),
              totalMatches: randomInt(100, 3000),
              soloKd: randomFloat(1, 6),
              duoKd: randomFloat(1, 7),
              squadKd: randomFloat(2, 9),
              currentSeason: "C7S23",
            }
          : category === "CHESS"
            ? {
                chessRating: randomInt(800, 2400),
                chessUsername: `${user.username}_chess`,
                winRate: randomFloat(40, 75),
                winStreak: randomInt(1, 20),
                totalGames: randomInt(100, 5000),
                tournamentPlacements: randomInt(0, 30),
              }
            : {
                reactionTimeMs: randomFloat(150, 350),
                bestReactionMs: randomFloat(140, 300),
                tappingSpeed: randomInt(5, 14),
                sprintTimeSec: randomFloat(10.5, 18),
                challengeCompletions: randomInt(0, 50),
              };

    const rankScore = computeScore(category, {
      ...statData,
      isVerified: user.isVerified,
    });

    await prisma.categoryStat.upsert({
      where: { userId_category: { userId: user.id, category } },
      update: {},
      create: {
        userId: user.id,
        category,
        ...statData,
        rankScore,
        isVerified: user.isVerified,
        lastUpdated: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log("✓ Stats created for 30 users");

  // Challenges
  const challenges = [
    {
      title: "Kathmandu Fitness Championship",
      description: "Submit your best powerlifting total (bench + squat + deadlift) this month. Top lifters win recognition and premium subscription.",
      category: "FITNESS" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      prizeDescription: "1 Month Premium + Featured on Homepage",
      entryFeeNPR: 0,
      status: "ACTIVE" as const,
    },
    {
      title: "PUBG Nepal Seasonal Challenge",
      description: "Highest K/D ratio in PUBG Mobile Season C7S23 wins. Submit your season stats with screenshot proof.",
      category: "PUBG" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      prizeDescription: "NPR 5,000 + #1 PUBG Nepal Badge",
      entryFeeNPR: 0,
      status: "ACTIVE" as const,
    },
    {
      title: "Chess Rating Rush",
      description: "Highest chess.com rating gain in 30 days. Screenshot your starting and ending rating.",
      category: "CHESS" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      prizeDescription: "Chess.com Premium Gift + Trophy Badge",
      entryFeeNPR: 0,
      status: "ACTIVE" as const,
    },
    {
      title: "Fastest Reaction in Nepal",
      description: "Submit your best reaction time. Use humanbenchmark.com or any verified reaction test app.",
      category: "SPEED" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      prizeDescription: "Fastest Hands in Nepal Badge",
      entryFeeNPR: 0,
      status: "ACTIVE" as const,
    },
    {
      title: "Premium Powerlifters League",
      description: "Exclusive challenge for premium members. Heaviest powerlifting total relative to bodyweight wins.",
      category: "FITNESS" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      prizeDescription: "NPR 15,000 Cash Prize + Gold Trophy",
      entryFeeNPR: 299,
      status: "ACTIVE" as const,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({ data: challenge });
  }
  console.log("✓ 5 challenges created");

  // Public Figures / Leaders
  const figures = [
    { name: "KP Sharma Oli", office: "Former Prime Minister", officeLevel: "NATIONAL", party: "CPN-UML", province: "Koshi", description: "Long-serving politician and former Prime Minister of Nepal." },
    { name: "Pushpa Kamal Dahal (Prachanda)", office: "Prime Minister", officeLevel: "NATIONAL", party: "CPN (Maoist Centre)", province: "Bagmati", description: "Former guerrilla leader turned politician, current Prime Minister." },
    { name: "Ram Chandra Paudel", office: "President of Nepal", officeLevel: "NATIONAL", party: "Nepali Congress", province: "Gandaki" },
    { name: "Sher Bahadur Deuba", office: "Former Prime Minister", officeLevel: "NATIONAL", party: "Nepali Congress", province: "Sudurpashchim" },
    { name: "Balendra Shah", office: "Mayor of Kathmandu", officeLevel: "MUNICIPAL", party: "Independent", province: "Bagmati", description: "Popular rapper-turned-mayor known for infrastructure improvements." },
    { name: "Bidhya Devi Bhandari", office: "Former President", officeLevel: "NATIONAL", party: "CPN-UML", province: "Koshi" },
    { name: "Madhav Kumar Nepal", office: "Former Prime Minister", officeLevel: "NATIONAL", party: "CPN (Unified Socialist)", province: "Madhesh" },
    { name: "Ram Sahay Prasad Yadav", office: "Governor, Province 2", officeLevel: "PROVINCIAL", province: "Madhesh", party: "Federal" },
    { name: "Shankar Pokhrel", office: "Speaker, House of Representatives", officeLevel: "NATIONAL", party: "CPN-UML", province: "Bagmati" },
    { name: "Agni Sapkota", office: "Former Speaker", officeLevel: "NATIONAL", party: "CPN (Maoist Centre)", province: "Bagmati" },
    { name: "Renu Dahal", office: "Minister of Education", officeLevel: "NATIONAL", party: "CPN (Maoist Centre)", province: "Bagmati" },
    { name: "Rabi Lamichhane", office: "Home Minister", officeLevel: "NATIONAL", party: "RSP", province: "Gandaki", description: "Former journalist and TV host turned politician." },
    { name: "Indira Rana", office: "Chief Justice", officeLevel: "NATIONAL", province: "Bagmati" },
    { name: "Deepak Bohora", office: "Mayor, Dhangadhi", officeLevel: "MUNICIPAL", province: "Sudurpashchim" },
    { name: "Bidya Sundar Shakya", office: "Former Mayor, Kathmandu", officeLevel: "MUNICIPAL", party: "Nepali Congress", province: "Bagmati" },
  ];

  for (const fig of figures) {
    await prisma.publicFigure.create({
      data: {
        ...fig,
        officeLevel: fig.officeLevel as "LOCAL" | "MUNICIPAL" | "DISTRICT" | "PROVINCIAL" | "NATIONAL",
        approvalScore: randomFloat(25, 80),
        totalVotes: randomInt(50, 2000),
        trendDirection: pick(["UP", "DOWN", "STABLE"] as const),
        isActive: true,
        isVerified: fig.officeLevel === "NATIONAL",
      },
    });
  }
  console.log("✓ 15 public figures created");

  // Featured content
  await prisma.featuredContent.createMany({
    data: [
      {
        contentType: "CHALLENGE",
        contentId: "placeholder",
        title: "Kathmandu Fitness Championship - Running Now!",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        contentType: "LEADERBOARD",
        contentId: "FITNESS",
        title: "Top Fitness Athletes of 2025",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        contentType: "CATEGORY",
        contentId: "SPEED",
        title: "New: Speed & Reaction Leaderboard Launched!",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });
  console.log("✓ 3 featured content entries created");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
