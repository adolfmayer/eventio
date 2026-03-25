import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Create New",
};

export default function CreateNewPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <Card className="mx-auto w-full max-w-3xl p-6 sm:p-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
          03-2-1-Create-New-Event
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Create new event
        </h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Event name
            <Input
              className="mt-1"
              placeholder="Design Community Meetup"
            />
          </label>
          <label className="block text-sm font-medium text-text">
            Date
            <Input className="mt-1" placeholder="DD/MM/YYYY" />
          </label>
          <label className="block text-sm font-medium text-text">
            Time
            <Input className="mt-1" placeholder="19:00" />
          </label>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Location
            <Input className="mt-1" placeholder="Brno, Czechia" />
          </label>
          <label className="block text-sm font-medium text-text sm:col-span-2">
            Description
            <Textarea className="mt-1" placeholder="Write event details..." />
          </label>
          <div className="sm:col-span-2">
            <Button size="lg">Create Event</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}

