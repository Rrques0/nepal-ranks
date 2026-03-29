import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/lib/supabase/server";
import { getUserBySupabaseId } from "@/lib/db/queries";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error(e);
    return "An unexpected error occurred.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getUserBySupabaseId(supabaseUser.id);
  if (!dbUser) {
    throw new Error("User not found");
  }

  if (dbUser.isBanned) {
    throw new Error("Account is banned");
  }

  return next({ ctx: { supabaseUser, dbUser } });
});

export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  if (ctx.dbUser.role !== "ADMIN" && ctx.dbUser.role !== "MODERATOR") {
    throw new Error("Forbidden: Admin access required");
  }
  return next({ ctx });
});
