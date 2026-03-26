"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/features/auth/sign-out-button";

type DashboardProfileMenuProps = {
  fullName: string | null;
  email: string | null;
};

function getInitials(nameOrEmail: string | null) {
  const base = (nameOrEmail ?? "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function DashboardProfileMenu({ fullName, email }: DashboardProfileMenuProps) {
  const [open, setOpen] = React.useState(false);
  const nameOrEmail = fullName ?? email;
  const initials = getInitials(nameOrEmail);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9DCE1] text-[11.2px] font-medium text-[#949EA8] sm:h-10 sm:w-10 sm:text-[14px]">
          {initials}
        </div>
        <span className="hidden text-[14px] font-medium leading-6 text-[#949EA8] sm:inline">
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
          className="absolute right-0 mt-3 w-[162px] rounded-[14px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.198087)]"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="block px-4 py-3 text-[14px] font-medium leading-6 text-[#9CA5AF] hover:bg-surfaceAlt"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <div className="px-4 pb-3">
            <SignOutButton
              variant="ghost"
              size="sm"
              className="h-auto w-full justify-start px-0 py-0 text-[14px] font-medium leading-6 text-[#9CA5AF] hover:bg-transparent"
            >
              Log out
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

