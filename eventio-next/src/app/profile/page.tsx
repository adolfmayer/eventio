import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <Card className="mx-auto grid w-full max-w-4xl gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_2fr]">
        <aside className="rounded-card bg-surfaceAlt p-5">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
            AL
          </div>
          <h1 className="mt-4 text-center text-xl font-semibold text-text">
            Ada Lovelace
          </h1>
          <p className="mt-1 text-center text-sm text-muted">
            Product Engineer
          </p>
        </aside>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
            04-1-1-My-Profile
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text">
            My profile
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-stroke bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                Joined events
              </p>
              <p className="mt-2 text-2xl font-semibold text-text">18</p>
            </div>
            <div className="rounded-card border border-stroke bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                Created events
              </p>
              <p className="mt-2 text-2xl font-semibold text-text">4</p>
            </div>
          </div>
          <div className="mt-6 rounded-card border border-stroke bg-surface p-4 text-sm text-muted">
            <p>
              <span className="font-semibold text-text">Email:</span>{" "}
              {data.user.email ?? "—"}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-text">User ID:</span>{" "}
              {data.user.id}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" size="lg">
              Edit Profile
            </Button>
            <SignOutButton variant="danger" size="lg">
              Sign out
            </SignOutButton>
          </div>
        </div>
      </Card>
    </main>
  );
}

