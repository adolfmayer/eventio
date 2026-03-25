import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <section>
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
            SIGN UP
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
            Create your Eventio profile.
          </h1>
          <p className="mt-3 max-w-md text-base text-muted">
            Build your attendee identity and start joining events instantly.
          </p>
          <span className="mt-7 inline-block rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-muted border border-stroke">
            01-3-1-Sign-Up
          </span>
        </section>

        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            Get started
          </h2>
          <p className="mt-2 text-sm text-muted">
            Set up your account in less than a minute.
          </p>
          <form className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-text">
              Full Name
              <Input className="mt-1" placeholder="Ada Lovelace" />
            </label>
            <label className="block text-sm font-medium text-text">
              Email
              <Input className="mt-1" type="email" placeholder="ada@example.com" />
            </label>
            <label className="block text-sm font-medium text-text">
              Password
              <Input className="mt-1" type="password" placeholder="********" />
            </label>
            <Button className="w-full" size="lg">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?
            <Link className="ml-1 font-semibold text-dangerStrong" href="/login">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

