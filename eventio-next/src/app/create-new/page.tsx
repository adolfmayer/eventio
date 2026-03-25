import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/features/events/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create New",
};

export default async function CreateNewPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?redirectTo=/create-new");

  const params = (await searchParams) ?? {};

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <Card className="mx-auto w-full max-w-3xl p-6 sm:p-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
          03-2-1-Create-New-Event
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Create new event
        </h1>
        {params.error ? (
          <p className="mt-4 whitespace-pre-line text-sm text-dangerStrong">
            {params.error}
          </p>
        ) : null}
        <form className="mt-6 grid gap-4 sm:grid-cols-2" action={createEventAction}>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Event name
            <Input
              className="mt-1"
              placeholder="Design Community Meetup"
              name="title"
              required
            />
          </label>
          <label className="block text-sm font-medium text-text">
            Date
            <Input className="mt-1" placeholder="YYYY-MM-DD" name="date" required />
          </label>
          <label className="block text-sm font-medium text-text">
            Time
            <Input className="mt-1" placeholder="19:00" name="time" required />
          </label>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Location
            <Input className="mt-1" placeholder="Brno, Czechia" name="location" />
          </label>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Capacity
            <Input className="mt-1" placeholder="150" name="capacity" inputSize="md" />
          </label>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Description
            <Textarea className="mt-1" placeholder="Write event details..." name="description" />
          </label>
          <div className="sm:col-span-2">
            <Button size="lg" type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}

