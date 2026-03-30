"use client";

import * as React from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ToastKey = "joined" | "left" | "created" | "edited" | "deleted";

const SUCCESS_BY_KEY: Record<ToastKey, string> = {
  joined: "Successfully joined - enjoy the event.",
  left: "You left the event.",
  created: "Event successfully created.",
  edited: "Event successfully edited.",
  deleted: "You deleted the event.",
};

export function ToastBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const error = searchParams.get("error");
    const toastKeyRaw = searchParams.get("toast");

    const toastKey: ToastKey | null =
      toastKeyRaw === "joined" ||
      toastKeyRaw === "left" ||
      toastKeyRaw === "created" ||
      toastKeyRaw === "edited" ||
      toastKeyRaw === "deleted"
        ? toastKeyRaw
        : null;

    if (!error && !toastKey) return;

    if (error) toast.error(error);
    if (toastKey) toast.success(SUCCESS_BY_KEY[toastKey]);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("error");
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}

