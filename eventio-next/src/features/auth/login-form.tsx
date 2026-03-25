"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginFormState = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = React.useState<LoginFormState>({
    email: "tomas.vranek@strv.co",
    password: "..........",
    isSubmitting: false,
    error: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState((s) => ({ ...s, isSubmitting: true, error: null }));

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });

    if (error) {
      setState((s) => ({ ...s, isSubmitting: false, error: error.message }));
      return;
    }

    const redirectTo = searchParams.get("redirectTo");
    router.replace(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard");
    router.refresh();
  }

  return (
    <form className="mt-6 w-full space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm leading-6 text-muted lg:text-[18px]">
        Email
        <Input
          className="mt-1"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          required
        />
      </label>
      <label className="block text-sm leading-6 text-muted lg:text-[18px]">
        Password
        <Input
          className="mt-1"
          type="password"
          autoComplete="current-password"
          value={state.password}
          onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
          required
        />
      </label>

      {state.error ? (
        <p className="text-sm text-dangerStrong">{state.error}</p>
      ) : null}

      <Button
        className="mt-2 h-[57px] w-full rounded-control text-[16px] font-normal uppercase tracking-[1px]"
        type="submit"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

