'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type LoginFormState = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
};

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);

  const [state, setState] = React.useState<LoginFormState>({
    email: '',
    password: '',
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

    const redirectTo = searchParams.get('redirectTo');
    router.replace(
      redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'
    );
    router.refresh();
  }

  return (
    <form className="mt-[48px] w-full lg:mt-[80px]" onSubmit={onSubmit}>
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
          placeholder=""
          required
        />
      </label>

      <label className="mt-10 block lg:mt-8">
        <span className="text-[16px] leading-6 text-[#C9CED3] lg:text-[18px]">
          Password
        </span>
        <div className="relative mt-2 h-8">
          <input
            className="h-8 w-full border-0 border-b border-[#DAE1E7] bg-transparent px-0 pr-8 text-[16px] leading-6 text-text outline-none transition placeholder:text-[#D2D6DA] focus:border-text lg:text-[18px]"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={state.password}
            onChange={(e) =>
              setState((s) => ({ ...s, password: e.target.value }))
            }
            placeholder=""
            required
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className={cn(
              'absolute right-0 top-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-[#E1E4E6] transition',
              showPassword
                ? 'bg-brand/10 text-brand'
                : ''
            )}
          >
            <EyeIcon />
          </button>
        </div>
      </label>

      <p className="mt-8 text-center text-[14px] leading-6 text-[#C9CED3] lg:hidden">
        Don&apos;t have account?
        <Link
          href="/signup"
          className="ml-1 font-semibold tracking-[1px] text-text hover:underline"
        >
          SIGN UP
        </Link>
      </p>

      {state.error ? (
        <p className="mt-2 text-[14px] leading-6 text-danger">{state.error}</p>
      ) : null}

      <Button
        className="mt-[88px] h-[57px] w-full rounded-[4px] text-[16px] font-normal uppercase tracking-[1px] hover:bg-brandStrong lg:mt-16"
        type="submit"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? 'Loading...' : 'Sign in'}
      </Button>
    </form>
  );
}
