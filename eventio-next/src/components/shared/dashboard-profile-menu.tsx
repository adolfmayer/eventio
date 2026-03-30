"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/features/auth/sign-out-button";

type DashboardProfileMenuProps = {
  fullName: string | null;
  email: string | null;
};

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "eventio.theme";

function getThemeFromDom(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setThemeOnDom(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

function readStoredTheme(): ThemeMode | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "dark" || raw === "light") return raw;
  } catch {
    // ignore
  }
  return null;
}

function storeTheme(theme: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

function getInitials(nameOrEmail: string | null) {
  const base = (nameOrEmail ?? "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function DashboardProfileMenu({ fullName, email }: DashboardProfileMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<ThemeMode>("light");
  const nameOrEmail = fullName ?? email;
  const initials = getInitials(nameOrEmail);

  React.useEffect(() => {
    const stored = readStoredTheme();
    const next = stored ?? getThemeFromDom();
    setTheme(next);
    setThemeOnDom(next);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-[11.2px] font-medium text-muted sm:h-10 sm:w-10 sm:text-[14px]">
          {initials}
        </div>
        <span className="hidden text-[14px] font-medium leading-6 text-muted sm:inline">
          {fullName ?? "—"}
        </span>
        <Image
          src="/eventio/dashboard/icons/icon-chevron-down.svg"
          alt=""
          width={10}
          height={5}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 w-[162px] rounded-[14px] bg-surface shadow-[0px_5px_15px_rgba(0,0,0,0.198087)]"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="block px-4 py-3 text-[14px] font-medium leading-6 text-muted hover:bg-surfaceAlt"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitemcheckbox"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-medium leading-6 text-muted hover:bg-surfaceAlt"
            onClick={() => {
              const next: ThemeMode = theme === "dark" ? "light" : "dark";
              setTheme(next);
              setThemeOnDom(next);
              storeTheme(next);
            }}
            aria-checked={theme === "dark"}
          >
            <span>Dark mode</span>
            <span
              className={[
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                theme === "dark" ? "bg-brand" : "bg-stroke",
              ].join(" ")}
              aria-hidden="true"
            >
              <span
                className={[
                  "inline-block h-4 w-4 transform rounded-full bg-surface shadow transition",
                  theme === "dark" ? "translate-x-4" : "translate-x-1",
                ].join(" ")}
              />
            </span>
          </button>
          <div className="pb-3">
            <SignOutButton
              variant="ghost"
              size="sm"
              className="h-auto w-full justify-start rounded-none px-4 py-3 text-[14px] font-medium leading-6 text-muted hover:bg-surfaceAlt"
            >
              Log out
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

