import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Log In",
};

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="29"
      height="28"
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 26.942V0H16.872V4.94H5.244V11.096H15.77V15.77H5.244V22.002H16.872V26.942H0ZM21.47 23.75C21.47 22.7873 21.8057 21.9703 22.477 21.299C23.1483 20.6277 23.9653 20.292 24.928 20.292C25.4093 20.292 25.8653 20.3807 26.296 20.558C26.7267 20.7353 27.1003 20.9823 27.417 21.299C27.7337 21.6157 27.9807 21.983 28.158 22.401C28.3353 22.819 28.424 23.2687 28.424 23.75C28.424 24.2313 28.3353 24.681 28.158 25.099C27.9807 25.517 27.7337 25.8843 27.417 26.201C27.1003 26.5177 26.7267 26.7647 26.296 26.942C25.8653 27.1193 25.4093 27.208 24.928 27.208C23.9653 27.208 23.1483 26.8723 22.477 26.201C21.8057 25.5297 21.47 24.7127 21.47 23.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="fixed left-0 top-0 z-50 px-6 py-7 sm:px-10 lg:hidden">
        <LogoMark className="h-6 w-6 text-text" />
      </div>

      <div className="fixed right-0 top-0 z-50 px-6 py-7 sm:px-10">
        <p className="text-sm leading-6 text-muted">
          Don&apos;t have account?
          <Link
            href="/signup"
            className="ml-1 text-sm font-semibold leading-6 text-text hover:underline"
          >
            SIGN UP
          </Link>
        </p>
      </div>

      <div className="min-h-screen w-full lg:grid lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <aside className="relative hidden min-h-screen overflow-hidden bg-text lg:block">
          <div className="absolute inset-0 opacity-[0.11] bg-[radial-gradient(circle_at_top_left,white_0%,transparent_65%)]" />
          <div className="absolute left-[61px] top-[39px] text-white">
            <LogoMark />
          </div>
          <div className="absolute bottom-[86px] left-1/2 w-[310px] -translate-x-1/2 text-center">
            <p className="font-[var(--font-eventio-serif)] text-[36px] leading-[42px] text-white">
              &quot;Great, kid. Don&apos;t get cocky!&quot;
            </p>
            <div className="mx-auto mt-5 h-[2px] w-[12px] bg-brand" />
            <p className="mt-3 text-[18px] leading-6 text-white/60">
              Han Solo
            </p>
          </div>
        </aside>

        <section className="relative min-h-screen px-6 sm:px-10 lg:px-0">
          <div className="relative mx-auto min-h-screen w-full max-w-xl lg:px-12 xl:px-16">
            <div className="grid min-h-screen place-items-center">
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-[22px] font-normal leading-[48px] text-text lg:text-[28px]">
                    Sign in to Eventio.
                  </h1>
                  <p className="text-sm leading-6 text-muted lg:text-[18px]">
                    Enter your details below.
                  </p>
                </div>

                <form className="mt-6 w-full space-y-4">
                  <label className="block text-sm leading-6 text-muted lg:text-[18px]">
                    Email
                    <Input
                      className="mt-1"
                      type="email"
                      defaultValue="tomas.vranek@strv.co"
                    />
                  </label>
                  <label className="block text-sm leading-6 text-muted lg:text-[18px]">
                    Password
                    <Input
                      className="mt-1"
                      type="password"
                      defaultValue=".........."
                    />
                  </label>

                  <Button className="mt-2 h-[57px] w-full rounded-control text-[16px] font-normal uppercase tracking-[1px]">
                    Sign in
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

