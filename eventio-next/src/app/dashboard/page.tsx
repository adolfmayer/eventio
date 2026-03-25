import { DashboardShell } from "@/components/shared/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,location,starts_at")
    .order("starts_at", { ascending: true });

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="02-1-1-Dashboard"
      showSubtitle={true}
      listView={false}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {error ? (
          <Card className="p-5 sm:p-6 lg:col-span-3">
            <p className="text-sm text-dangerStrong">{error.message}</p>
          </Card>
        ) : null}

        {(events ?? []).map((event) => (
          <Card key={event.id} className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Events
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text">{event.title}</h2>
            <p className="mt-2 text-sm text-muted">
              {event.starts_at
                ? new Date(event.starts_at).toLocaleString()
                : "—"}{" "}
              · {event.location ?? "—"}
            </p>
            <Badge className="mt-3 w-fit">Open registration</Badge>
            <Link
              className="mt-4 inline-block text-sm font-semibold text-dangerStrong hover:text-danger"
              href={`/dashboard-detail?id=${encodeURIComponent(event.id)}`}
            >
              Open detail
            </Link>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

