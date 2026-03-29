import { NextResponse } from "next/server";
import { z } from "zod";
import { getLeaderboard } from "@/lib/db/queries";

const querySchema = z.object({
  category: z.enum(["FITNESS", "PUBG", "CHESS", "SPEED"]),
  province: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(25),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = await getLeaderboard(parsed.data);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
