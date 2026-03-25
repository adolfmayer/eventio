import Link from "next/link";

import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Eventio Static V1
        </h1>
        <p className="mt-2 text-sm text-muted">
          Navigate the static routes that mirror your Figma flows.
        </p>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/login"
            >
              Log In
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/signup"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/dashboard-list"
            >
              Dashboard List View
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/dashboard-detail"
            >
              Dashboard Detail
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/dashboard-detail-joined"
            >
              Dashboard Detail Joined
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/dashboard-detail-edit"
            >
              Dashboard Detail Edit
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/create-new"
            >
              Create New
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md border border-stroke px-4 py-3 font-medium text-text hover:bg-surfaceAlt"
              href="/profile"
            >
              Profile
            </Link>
          </li>
        </ul>
      </Card>
    </main>
  );
}
