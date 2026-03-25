import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "./env";

export function updateSupabaseSession(request: NextRequest) {
  const { url, anonKey } = getSupabasePublicEnv();

  const response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const refreshed = supabase.auth.getUser();

  return { supabase, response, refreshed } as const;
}

