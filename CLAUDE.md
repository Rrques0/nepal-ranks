# Nepal Ranks — Project Memory for Claude

## Project Overview
Nepal Ranks is a competitive leaderboard platform for young Nepali athletes, gamers, chess players, and citizens. It allows users to submit their stats in 4 categories (Fitness, PUBG, Chess, Speed) and get ranked nationally, by province, city, gender, and age group. There is also a public leader/politician rating module.

**Status:** MVP build in progress. Production target: Vercel.

---

## Tech Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (custom implementations in `components/ui/`)
- **Database ORM:** Prisma (PostgreSQL via Supabase)
- **Auth:** Supabase Auth via `@supabase/ssr`
- **Storage:** Supabase Storage (buckets: `avatars`, `proofs`)
- **Payments:** Stripe (subscriptions, NPR 299/month premium)
- **Server Actions:** next-safe-action with Zod validation
- **Mobile:** Capacitor (appId: com.nepalranks.app)
- **Validation:** Zod on all forms and server actions
- **Forms:** React Hook Form + @hookform/resolvers

---

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=           # Supabase connection pooler URL
DIRECT_URL=             # Supabase direct connection URL
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=    # e.g. https://nepalranks.com
NEXTAUTH_SECRET=        # Random secret
```

---

## How to Run Locally
```bash
# 1. Copy env file
cp .env.example .env.local
# Fill in all env vars

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to database
npx prisma db push

# 5. Seed database
npm run db:seed

# 6. Start dev server
npm run dev
```

---

## How to Build for Mobile (Capacitor)
```bash
# Android
npm run mobile:android

# iOS (Mac only)
npm run mobile:ios

# Just sync (after build)
npm run mobile:build
```
Note: Capacitor uses `next export` (`webDir: "out"`). Pages that use server components must have static export enabled or use ISR. For full SSR mobile, use Capacitor with a live server URL instead.

---

## Folder Structure
```
app/
  (auth)/           # Login, signup pages — no sidebar
  (dashboard)/      # All protected pages with sidebar nav
  (public)/         # Public-facing pages (user profiles, leaders)
  admin/            # Admin-only pages (ADMIN/MODERATOR role required)
  api/              # API routes + webhooks

components/
  ui/               # Base UI components (Button, Input, Card, etc.)
  layout/           # Navbar, Sidebar, MobileNav, Footer
  leaderboard/      # LeaderboardTable, RankBadge, filters
  profile/          # ProfileHeader, StatCard, CategoryStats, RankCard
  submit/           # Category-specific forms + ProofUpload
  leaders/          # LeaderCard, VoteButton, ApprovalMeter, Disclaimer
  challenges/       # ChallengeCard, JoinButton
  explore/          # TrendingUsers, TopByCity
  shared/           # LoadingSpinner, EmptyState, ErrorBoundary, ShareButton

lib/
  supabase/         # client.ts, server.ts, middleware.ts
  db/               # client.ts (Prisma singleton), queries.ts (all DB queries)
  actions/          # Server actions (auth, profile, submit, vote, challenges, admin)
  validations/      # Zod schemas (auth, profile, fitness, pubg, chess, speed, leader)
  ranking.ts        # Score computation and rank assignment
  stripe.ts         # Stripe client + checkout session creation
  constants.ts      # Provinces, cities, categories, tier values
  utils.ts          # cn(), formatters, helpers

prisma/
  schema.prisma     # Full DB schema
  seed.ts           # Realistic Nepali seed data
```

---

## Auth Pattern
- Supabase Auth via `@supabase/ssr`
- **Server components:** use `createClient()` from `lib/supabase/server.ts`
- **Client components:** use `createClient()` from `lib/supabase/client.ts`
- On signup: creates both Supabase auth user AND Prisma `User` record
- Middleware in `middleware.ts` protects `/dashboard/*`, `/admin/*`
- Admin check: `dbUser.role === "ADMIN" || "MODERATOR"`
- Auth callback route: `/api/auth/callback`

---

## Database Access Pattern
- All Prisma calls happen in **server components** or **server actions**
- Never use Prisma in client components
- Prisma singleton exported from `lib/db/client.ts`
- All query functions in `lib/db/queries.ts`
- Server actions in `lib/actions/` use `next-safe-action` clients:
  - `actionClient` — public actions
  - `authActionClient` — requires logged-in user
  - `adminActionClient` — requires ADMIN/MODERATOR role

---

## Ranking Score Formula

### FITNESS (0–1000)
- Strength ratio (bench+squat+deadlift) / bodyweight, normalized 0–12x = 60% (600pts)
- Consistency streak days, normalized 0–365 = 20% (200pts)
- Total volume kg, normalized 0–500,000 = 20% (200pts)
- Bonus: +50 if `isVerified = true`

### PUBG (0–1000)
- KD ratio normalized 0–10 = 40% (400pts)
- Win rate normalized 0–50% = 25% (250pts)
- Rank tier (1=Bronze, 8=Conqueror) normalized 1–8 = 20% (200pts)
- Avg damage normalized 0–800 = 15% (150pts)

### CHESS (0–1000)
- Rating normalized 0–3000 = 70% (700pts)
- Win rate normalized 0–100% = 20% (200pts)
- Tournament placements normalized 0–50 = 10% (100pts)

### SPEED (0–1000)
- Reaction time (lower is better, inverted) normalized 100–500ms = 40% (400pts)
- Tapping speed normalized 0–15 taps/sec = 30% (300pts)
- Sprint 100m time (lower is better, inverted) normalized 9–20s = 30% (300pts)

Rankings are assigned per-category across: national, province, city, gender, ageGroup.
Run `computeAllRankings()` from `lib/ranking.ts` to bulk recompute.

---

## Design System
```
Colors:
  #DC143C  Brand red (primary)
  #0A0A0A  Background
  #141414  Surface (cards)
  #1E1E1E  Surface 2
  #2A2A2A  Border
  #FFFFFF  Primary text
  #A0A0A0  Muted text
  #6B7280  Placeholder/secondary
  #FFD700  Gold (rank #1)
  #C0C0C0  Silver (rank #2)
  #CD7F32  Bronze (rank #3)
  #22C55E  Success green
  #F59E0B  Warning amber

Rules:
- Cards: rounded-xl, bg-[#141414], border border-[#2A2A2A]
- Buttons: minimum 44px tap target (mobile)
- Rank badges: colored by position (gold/silver/bronze/gray)
- Trend arrows: green up, red down, gray stable
- Skeleton loaders on all data-fetching components
- EmptyState component for empty lists
- Mobile-first — no horizontal scroll, bottom nav on mobile
```

---

## How to Add a New Category
1. Add to `Category` enum in `prisma/schema.prisma`
2. Add fields to `CategoryStat` model
3. Run `prisma migrate dev`
4. Add to `CATEGORIES` array in `lib/constants.ts`
5. Add `computeXxxScore()` in `lib/ranking.ts`
6. Add case to `computeScore()` switch
7. Create `lib/validations/xxx.ts` Zod schema
8. Create `lib/actions/submit.ts` action for the new category
9. Create `components/submit/XxxForm.tsx`
10. Create `app/(dashboard)/submit/xxx/page.tsx`
11. Create `app/(dashboard)/leaderboard/xxx/page.tsx`
12. Add to `CategoryFilter` component

---

## How to Add a New Leaderboard Filter
1. Add column to `User` or `CategoryStat` in schema
2. Run `prisma migrate dev`
3. Add to `getLeaderboard()` where clause in `lib/db/queries.ts`
4. Add filter UI to `RegionFilter.tsx`

---

## Stripe Integration
- Checkout: `createCheckoutSession()` in `lib/stripe.ts`
- Webhook: `app/api/stripe/webhook/route.ts`
- Events handled: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
- Premium duration: 30 days stored in `user.premiumUntil`

---

## Supabase Storage Buckets
Create these buckets in Supabase dashboard:
- `avatars` — public, for profile pictures
- `proofs` — public, for stat submission proof images

---

## Mobile (Capacitor) Notes
- AppId: `com.nepalranks.app`
- AppName: `Nepal Ranks`
- webDir: `out` (requires Next.js static export)
- Theme: dark (#0A0A0A background)
- StatusBar style: DARK

---

## Future Claude Sessions — Continuing This Project
When continuing development:
1. Read this file first
2. Check `prisma/schema.prisma` for current data model
3. Check `lib/constants.ts` for all categories, provinces, cities
4. All new server actions go in `lib/actions/`
5. All new DB queries go in `lib/db/queries.ts`
6. Use `authActionClient` for protected actions, `adminActionClient` for admin
7. Follow the existing component patterns — card styles, badge variants, etc.
8. Run `npm run db:generate` after any schema changes
9. The politician section ALWAYS shows `<LeaderDisclaimer />` — non-negotiable
10. Mobile-first — test on 375px width first
