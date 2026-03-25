const missingEnv = (key: string) =>
  new Error(
    `Missing required environment variable: ${key}. Add it to .env.local (see .env.example).`,
  );

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw missingEnv("NEXT_PUBLIC_SUPABASE_URL");

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw missingEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return { url, anonKey } as const;
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw missingEnv("SUPABASE_SERVICE_ROLE_KEY");
  return serviceRoleKey;
}

