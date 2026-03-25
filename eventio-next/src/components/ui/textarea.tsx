import * as React from "react";

import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-28 border border-stroke bg-surface text-text placeholder:text-muted outline-none transition rounded-control px-4 py-3 text-base",
          "focus:border-text focus:ring-2 focus:ring-text/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

