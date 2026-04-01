import { NextResponse, type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/dashboard-list",
  "/dashboard-detail",
  "/dashboard-detail-joined",
  "/dashboard-detail-edit",
  "/create-new",
  "/profile",
] as const;

const AUTH_PAGES = ["/login", "/signup"] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((p) => pathname === p);
}

export async function middleware(request: NextRequest) {
  const { response, refreshed } = updateSupabaseSession(request);
  const { data, error } = await refreshed;

  // If auth fails, treat as unauthenticated for routing decisions.
  const isAuthed = !error && Boolean(data.user);

  const { pathname } = request.nextUrl;

  if (!isAuthed && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);

    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  }

  if (isAuthed && isAuthPage(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";

    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public assets)
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|images).*)",
  ],
};

