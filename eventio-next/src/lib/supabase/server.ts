import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // If called from a Server Component render path, Next may disallow setting cookies.
          // It's safe to ignore here; middleware should keep sessions fresh.
        }
      },
    },
  });
}

