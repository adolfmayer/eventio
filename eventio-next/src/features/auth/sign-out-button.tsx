"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type SignOutButtonProps = Omit<ButtonProps, "onClick">;

export function SignOutButton(props: SignOutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onClick() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsSubmitting(false);
      setError(error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Button {...props} onClick={onClick} disabled={isSubmitting || props.disabled}>
        {isSubmitting ? "Signing out..." : props.children}
      </Button>
      {error ? <p className="text-sm text-dangerStrong">{error}</p> : null}
    </div>
  );
}

