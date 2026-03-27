"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ForgotPasswordState = {
  email: string;
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

export function ForgotPasswordForm() {
  const [state, setState] = React.useState<ForgotPasswordState>({
    email: "",
    isSubmitting: false,
    successMessage: null,
    errorMessage: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setState((s) => ({
      ...s,
      isSubmitting: true,
      successMessage: null,
      errorMessage: null,
    }));

    const supabase = createSupabaseBrowserClient();
    const redirectTo =
      typeof window === "undefined"
        ? undefined
        : `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(state.email.trim(), {
      redirectTo,
    });

    if (error) {
      setState((s) => ({
        ...s,
        isSubmitting: false,
        errorMessage: "We couldn't send the reset email right now. Please try again soon.",
      }));
      return;
    }

    setState((s) => ({
      ...s,
      isSubmitting: false,
      successMessage:
        "If an account with that email exists, we've sent a password reset link. Check your inbox and spam folder.",
    }));
  }

  return (
    <form className="mt-[48px] w-full lg:mt-[64px]" onSubmit={onSubmit} noValidate>
      <label className="block">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Email
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          required
        />
      </label>

      {state.successMessage ? (
        <p className="mt-6 text-[14px] leading-6 text-[#2E7D32]">{state.successMessage}</p>
      ) : null}
      {state.errorMessage ? (
        <p className="mt-6 text-[14px] leading-6 text-danger">{state.errorMessage}</p>
      ) : null}

      <Button
        className="mt-[64px] h-[57px] w-full rounded-[4px] text-[16px] font-normal uppercase tracking-[1px] hover:bg-brandStrong lg:mt-16"
        type="submit"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <p className="mt-8 text-center text-[14px] leading-6 text-[#C9CED3]">
        Remembered your password?
        <Link href="/login" className="ml-1 font-semibold tracking-[1px] text-text hover:underline">
          SIGN IN
        </Link>
      </p>
    </form>
  );
}

