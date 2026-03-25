import * as React from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "soft" | "brand" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const byVariant: Record<BadgeVariant, string> = {
  soft: "bg-surfaceAlt text-text border border-stroke",
  brand: "bg-brand text-white",
  danger: "bg-danger text-white",
};

export function Badge({ className, variant = "soft", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-control px-2.5 py-1 text-xs font-semibold",
        byVariant[variant],
        className,
      )}
      {...props}
    />
  );
}

