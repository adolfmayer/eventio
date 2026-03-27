"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ResetPasswordState = {
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = React.useState<ResetPasswordState>({
    password: "",
    repeatPassword: "",
    isSubmitting: false,
    successMessage: null,
    errorMessage: null,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.password.length < 6) {
      setState((s) => ({
        ...s,
        errorMessage: "Password must be at least 6 characters.",
        successMessage: null,
      }));
      return;
    }

    if (state.password !== state.repeatPassword) {
      setState((s) => ({
        ...s,
        errorMessage: "Passwords do not match.",
        successMessage: null,
      }));
      return;
    }

    setState((s) => ({
      ...s,
      isSubmitting: true,
      successMessage: null,
      errorMessage: null,
    }));

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: state.password });

    if (error) {
      setState((s) => ({
        ...s,
        isSubmitting: false,
        errorMessage:
          "We couldn't update your password. Re-open your reset link and try again.",
      }));
      return;
    }

    setState((s) => ({
      ...s,
      isSubmitting: false,
      successMessage: "Your password has been reset. Redirecting to login...",
    }));

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
  }

  return (
    <form className="mt-[48px] w-full lg:mt-[64px]" onSubmit={onSubmit} noValidate>
      <label className="block">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          New password
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="password"
          autoComplete="new-password"
          value={state.password}
          onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
          minLength={6}
          required
        />
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Repeat password
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="password"
          autoComplete="new-password"
          value={state.repeatPassword}
          onChange={(e) =>
            setState((s) => ({ ...s, repeatPassword: e.target.value }))
          }
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
        {state.isSubmitting ? "Saving..." : "Reset password"}
      </Button>

      <p className="mt-8 text-center text-[14px] leading-6 text-[#C9CED3]">
        Back to
        <Link href="/login" className="ml-1 font-semibold tracking-[1px] text-text hover:underline">
          SIGN IN
        </Link>
      </p>
    </form>
  );
}

