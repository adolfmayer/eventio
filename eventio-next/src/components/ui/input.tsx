import * as React from "react";

import { cn } from "@/lib/cn";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  inputSize?: "md" | "lg";
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "lg", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full border border-stroke bg-surface text-text placeholder:text-muted outline-none transition rounded-control",
          "focus:border-text focus:ring-2 focus:ring-text/15",
          inputSize === "md" ? "h-10 px-3 text-sm" : "h-11 px-4 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

