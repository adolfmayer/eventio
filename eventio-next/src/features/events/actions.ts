"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createEventSchema } from "./schemas";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createEventAction(formData: FormData) {
  const parsed = createEventSchema.safeParse({
    title: getString(formData, "title"),
    date: getString(formData, "date"),
    time: getString(formData, "time"),
    location: getString(formData, "location") || undefined,
    description: getString(formData, "description") || undefined,
    capacity: getString(formData, "capacity") || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("\n");
    redirect(`/create-new?error=${encodeURIComponent(message)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?redirectTo=/create-new");

  const startsAtIso = new Date(`${parsed.data.date}T${parsed.data.time}:00`).toISOString();

  const { data, error } = await supabase
    .from("events")
    .insert({
      owner_id: auth.user.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      location: parsed.data.location ?? null,
      starts_at: startsAtIso,
      capacity: parsed.data.capacity,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/create-new?error=${encodeURIComponent(error?.message ?? "Failed to create event")}`);
  }

  redirect(`/dashboard-detail?id=${encodeURIComponent(data.id)}`);
}

export async function joinEventAction(formData: FormData) {
  const eventId = getString(formData, "eventId");
  if (!eventId) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?redirectTo=${encodeURIComponent(`/dashboard-detail?id=${eventId}`)}`);

  const { error } = await supabase.from("event_attendees").insert({
    event_id: eventId,
    user_id: auth.user.id,
  });

  // Ignore duplicate joins (PK) — treat as idempotent UX.
  if (error && !/duplicate key/i.test(error.message)) {
    redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);
}

export async function leaveEventAction(formData: FormData) {
  const eventId = getString(formData, "eventId");
  if (!eventId) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?redirectTo=${encodeURIComponent(`/dashboard-detail?id=${eventId}`)}`);

  const { error } = await supabase
    .from("event_attendees")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", auth.user.id);

  if (error) {
    redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);
}

