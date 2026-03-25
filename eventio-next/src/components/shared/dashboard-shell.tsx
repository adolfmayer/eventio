import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type DashboardShellProps = {
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  listView?: boolean;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  showSubtitle,
  listView,
  children,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-6 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
                Eventio
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                {title}
              </h1>
              {Boolean(showSubtitle && subtitle) ? (
                <p className="mt-1 text-sm text-muted">{subtitle}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm">
                SHOW: ALL EVENTS
              </Button>
              <Button
                size="sm"
                variant={listView ? "primary" : "secondary"}
                className={cn("transition")}
              >
                List View
              </Button>
              <Button
                size="sm"
                variant={listView ? "secondary" : "primary"}
                className={cn("transition")}
              >
                Grid View
              </Button>
            </div>
          </div>
        </Card>

        {children}
      </div>
    </main>
  );
}

