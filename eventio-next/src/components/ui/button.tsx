import * as React from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition disabled:opacity-50 disabled:pointer-events-none";

const byVariant: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brandStrong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  secondary:
    "border border-stroke bg-surface text-text shadow-sm hover:bg-surfaceAlt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text",
  ghost:
    "text-text hover:bg-surfaceAlt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text",
  danger:
    "bg-danger text-white hover:bg-dangerStrong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger",
};

const bySize: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-control",
  md: "h-11 px-4 text-sm rounded-control",
  lg: "h-12 px-5 text-base rounded-control",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(base, byVariant[variant], bySize[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

