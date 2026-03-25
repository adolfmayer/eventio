import { type NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, refreshed } = updateSupabaseSession(request);
  await refreshed;

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
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};

