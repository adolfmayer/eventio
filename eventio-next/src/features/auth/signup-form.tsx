"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignupFormState = {
  phase: "form" | "success";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
  isResending: boolean;
  submittedEmail: string | null;
  successMessage: string | null;
  errors: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    repeatPassword: string | null;
    form: string | null;
  };
};

function toUserFacingSignupError(rawMessage: string) {
  const normalized = rawMessage.toLowerCase();

  if (/rate limit|too many|security purposes/.test(normalized)) {
    return "You've requested too many emails. Please wait a few minutes and try again.";
  }

  if (/already|exists|registered/.test(normalized)) {
    return "This email may already be registered. Try signing in or resetting your password.";
  }

  return rawMessage;
}

function isSignupRateLimitError(rawMessage: string) {
  return /rate limit|too many|security purposes/.test(rawMessage.toLowerCase());
}

export function SignupForm() {
  const router = useRouter();

  const [state, setState] = React.useState<SignupFormState>({
    phase: "form",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    isSubmitting: false,
    isResending: false,
    submittedEmail: null,
    successMessage: null,
    errors: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      repeatPassword: null,
      form: null,
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstName = state.firstName.trim();
    const lastName = state.lastName.trim();
    const nextErrors: SignupFormState["errors"] = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      repeatPassword: null,
      form: null,
    };

    if (!firstName) {
      nextErrors.firstName = "First name is required.";
    }
    if (!lastName) {
      nextErrors.lastName = "Last name is required.";
    }
    if (!state.email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (state.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (state.password !== state.repeatPassword) {
      nextErrors.repeatPassword = "Passwords do not match.";
    }
    if (state.repeatPassword.length === 0) {
      nextErrors.repeatPassword = "Repeat password is required.";
    }

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setState((s) => ({ ...s, errors: nextErrors }));
      return;
    }

    setState((s) => ({
      ...s,
      isSubmitting: true,
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        repeatPassword: null,
        form: null,
      },
    }));

    const supabase = createSupabaseBrowserClient();
    const fullName = `${firstName} ${lastName}`.trim();
    const { error } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
        },
      },
    });

    if (error) {
      if (isSignupRateLimitError(error.message)) {
        setState((s) => ({
          ...s,
          phase: "success",
          isSubmitting: false,
          submittedEmail: s.email.trim(),
          successMessage:
            "Verification email may be delayed due to provider rate limits. Please check your inbox in a few minutes.",
          errors: {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            repeatPassword: null,
            form: null,
          },
        }));
        return;
      }

      setState((s) => ({
        ...s,
        isSubmitting: false,
        errors: { ...s.errors, form: toUserFacingSignupError(error.message) },
      }));
      return;
    }

    setState((s) => ({
      ...s,
      phase: "success",
      isSubmitting: false,
      submittedEmail: s.email.trim(),
      successMessage: null,
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        repeatPassword: null,
        form: null,
      },
    }));
  }

  async function onResendVerification() {
    const email = state.submittedEmail?.trim();
    if (!email) return;

    setState((s) => ({
      ...s,
      isResending: true,
      successMessage: null,
      errors: { ...s.errors, form: null },
    }));

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setState((s) => ({
        ...s,
        isResending: false,
        errors: {
          ...s.errors,
          form: toUserFacingSignupError(error.message),
        },
      }));
      return;
    }

    setState((s) => ({
      ...s,
      isResending: false,
      successMessage: "Verification email sent. Please check your inbox.",
      errors: { ...s.errors, form: null },
    }));
  }

  if (state.phase === "success") {
    return (
      <div className="mt-[48px] w-full lg:mt-[64px]">
        <h2 className="text-[22px] font-normal leading-[48px] text-text lg:text-[28px]">
          Check your email
        </h2>
        <p className="text-[14px] leading-6 text-[#949EA8] lg:text-[18px]">
          We sent a verification link to{" "}
          <span className="font-semibold text-text">
            {state.submittedEmail ?? "your email"}
          </span>
          .
        </p>
        <p className="mt-2 text-[14px] leading-6 text-[#949EA8] lg:text-[16px]">
          Open the email and click the link to activate your account.
        </p>
        <p className="mt-4 text-[14px] leading-6 text-[#949EA8] lg:text-[16px]">
          Can&apos;t find it? Check your spam, promotions, or social folders.
        </p>

        {state.successMessage ? (
          <p className="mt-4 text-[14px] leading-6 text-[#2E7D32]">
            {state.successMessage}
          </p>
        ) : null}
        {state.errors.form ? (
          <p className="mt-4 text-[14px] leading-6 text-danger">
            {state.errors.form}
          </p>
        ) : null}

        <Button
          className="mt-[40px] h-[57px] w-full rounded-[4px] text-[16px] font-normal uppercase tracking-[1px] hover:bg-brandStrong"
          type="button"
          onClick={onResendVerification}
          disabled={state.isResending}
        >
          {state.isResending ? "Sending..." : "Resend verification email"}
        </Button>

        <Button
          className="mt-4 h-[57px] w-full rounded-[4px] border border-[#DAE1E7] bg-transparent text-[16px] font-normal uppercase tracking-[1px] text-text hover:bg-[#F6F7F9]"
          type="button"
          onClick={() => {
            router.push("/login");
            router.refresh();
          }}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-[48px] w-full lg:mt-[64px]" onSubmit={onSubmit} noValidate>
      <label className="block">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          First name
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="text"
          value={state.firstName}
          onChange={(e) =>
            setState((s) => ({ ...s, firstName: e.target.value }))
          }
          autoComplete="given-name"
          required
        />
        {state.errors.firstName ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">
            {state.errors.firstName}
          </p>
        ) : null}
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Last name
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="text"
          value={state.lastName}
          onChange={(e) => setState((s) => ({ ...s, lastName: e.target.value }))}
          autoComplete="family-name"
          required
        />
        {state.errors.lastName ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">
            {state.errors.lastName}
          </p>
        ) : null}
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Email
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          autoComplete="email"
          required
        />
        {state.errors.email ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">
            {state.errors.email}
          </p>
        ) : null}
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Password
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="password"
          value={state.password}
          onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
          autoComplete="new-password"
          minLength={6}
          required
        />
        {state.errors.password ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">
            {state.errors.password}
          </p>
        ) : null}
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Repeat password
        </span>
        <input
          className="mt-2 h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
          type="password"
          value={state.repeatPassword}
          onChange={(e) =>
            setState((s) => ({ ...s, repeatPassword: e.target.value }))
          }
          autoComplete="new-password"
          required
        />
        {state.errors.repeatPassword ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">
            {state.errors.repeatPassword}
          </p>
        ) : null}
      </label>

      <p className="mt-8 text-center text-[14px] leading-6 text-[#C9CED3] lg:hidden">
        Already have an account?
        <Link
          href="/login"
          className="ml-1 font-semibold tracking-[1px] text-text hover:underline"
        >
          SIGN IN
        </Link>
      </p>

      {state.errors.form ? (
        <p className="mt-2 text-[14px] leading-6 text-danger">
          {state.errors.form}
        </p>
      ) : null}

      <Button
        className="mt-[64px] h-[57px] w-full rounded-[4px] text-[16px] font-normal uppercase tracking-[1px] hover:bg-brandStrong lg:mt-16"
        type="submit"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? "Loading..." : "Sign up"}
      </Button>
    </form>
  );
}

