import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getUserBySupabaseId } from "@/lib/db/queries";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Protected routes: require auth
  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/dashboard";
  const isProfileRoute = pathname.startsWith("/profile");
  const isSubmitRoute = pathname.startsWith("/submit");
  const isChallengesWrite = pathname.startsWith("/challenges") && request.method !== "GET";
  const isUpgrade = pathname.startsWith("/upgrade");
  const isAdmin = pathname.startsWith("/admin");

  const requiresAuth =
    isDashboard ||
    isProfileRoute ||
    isSubmitRoute ||
    isUpgrade ||
    (pathname.startsWith("/challenges") && !pathname.includes("/challenges/"));

  if (requiresAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes require ADMIN role
  if (isAdmin && user) {
    const dbUser = await getUserBySupabaseId(user.id);
    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "MODERATOR")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isAdmin && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
