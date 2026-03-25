"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignupFormState = {
  fullName: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

export function SignupForm() {
  const router = useRouter();

  const [state, setState] = React.useState<SignupFormState>({
    fullName: "",
    email: "",
    password: "",
    isSubmitting: false,
    error: null,
    success: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState((s) => ({ ...s, isSubmitting: true, error: null, success: null }));

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: {
        data: {
          full_name: state.fullName || undefined,
        },
      },
    });

    if (error) {
      setState((s) => ({ ...s, isSubmitting: false, error: error.message }));
      return;
    }

    // Depending on Supabase email confirmation settings:
    // - user might be logged in immediately, or
    // - they must confirm via email.
    setState((s) => ({
      ...s,
      isSubmitting: false,
      success: "Account created. If required, check your email to confirm.",
    }));

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm font-medium text-text">
        Full Name
        <Input
          className="mt-1"
          value={state.fullName}
          onChange={(e) => setState((s) => ({ ...s, fullName: e.target.value }))}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
      </label>
      <label className="block text-sm font-medium text-text">
        Email
        <Input
          className="mt-1"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          placeholder="ada@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label className="block text-sm font-medium text-text">
        Password
        <Input
          className="mt-1"
          type="password"
          value={state.password}
          onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
          placeholder="********"
          autoComplete="new-password"
          required
        />
      </label>

      {state.error ? (
        <p className="text-sm text-dangerStrong">{state.error}</p>
      ) : null}
      {state.success ? <p className="text-sm text-muted">{state.success}</p> : null}

      <Button className="w-full" size="lg" type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}

