"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createEventSchema } from "./schemas";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export type CreateEventActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

export type UpdateEventActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

export async function createEventAction(formData: FormData) {
  const parsed = createEventSchema.safeParse({
    title: getString(formData, "title"),
    date: getString(formData, "date"),
    time: getString(formData, "time"),
    location: getString(formData, "location"),
    description: getString(formData, "description"),
    capacity: getString(formData, "capacity") || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("\n");
    return { ok: false, error: message } satisfies CreateEventActionResult;
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
    return {
      ok: false,
      error: error?.message ?? "Failed to create event",
    } satisfies CreateEventActionResult;
  }

  redirect(`/dashboard-detail?id=${encodeURIComponent(data.id)}&toast=created`);
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

  redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}&toast=joined`);
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

  redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}&toast=left`);
}

export async function updateEventAction(formData: FormData) {
  const eventId = getString(formData, "eventId");
  if (!eventId) redirect("/dashboard");

  const parsed = createEventSchema.safeParse({
    title: getString(formData, "title"),
    date: getString(formData, "date"),
    time: getString(formData, "time"),
    location: getString(formData, "location"),
    description: getString(formData, "description"),
    capacity: getString(formData, "capacity") || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("\n");
    return { ok: false, error: message } satisfies UpdateEventActionResult;
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/dashboard-detail-edit?id=${eventId}`)}`);
  }

  const { data: ownerEvent, error: ownerError } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (ownerError || !ownerEvent) {
    redirect(`/dashboard?error=${encodeURIComponent(ownerError?.message ?? "Event not found")}`);
  }

  if (ownerEvent.owner_id !== auth.user.id) {
    redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);
  }

  const startsAtIso = new Date(`${parsed.data.date}T${parsed.data.time}:00`).toISOString();

  const { error } = await supabase
    .from("events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      location: parsed.data.location ?? null,
      starts_at: startsAtIso,
      capacity: parsed.data.capacity,
    })
    .eq("id", eventId);

  if (error) {
    return { ok: false, error: error.message } satisfies UpdateEventActionResult;
  }

  redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}&toast=edited`);
}

export async function deleteEventAction(formData: FormData) {
  const eventId = getString(formData, "eventId");
  if (!eventId) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/dashboard-detail-edit?id=${eventId}`)}`);
  }

  const { data: ownerEvent, error: ownerError } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .single();

  if (ownerError || !ownerEvent) {
    redirect(`/dashboard?error=${encodeURIComponent(ownerError?.message ?? "Event not found")}`);
  }

  if (ownerEvent.owner_id !== auth.user.id) {
    redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);
  }

  const { error: attendeesDeleteError } = await supabase
    .from("event_attendees")
    .delete()
    .eq("event_id", eventId);
  if (attendeesDeleteError) {
    redirect(
      `/dashboard-detail-edit?id=${encodeURIComponent(eventId)}&error=${encodeURIComponent(attendeesDeleteError.message)}`,
    );
  }

  const { error: eventDeleteError } = await supabase.from("events").delete().eq("id", eventId);
  if (eventDeleteError) {
    redirect(
      `/dashboard-detail-edit?id=${encodeURIComponent(eventId)}&error=${encodeURIComponent(eventDeleteError.message)}`,
    );
  }

  redirect("/dashboard?toast=deleted");
}

