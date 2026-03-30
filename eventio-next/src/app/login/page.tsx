import Link from "next/link";
import Image from "next/image";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "@/features/auth/login-form";
import { redirect } from "next/navigation";

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

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-bg">
      <aside className="fixed left-0 top-0 hidden h-screen w-[480px] overflow-hidden bg-text lg:block">
        <div className="absolute inset-0">
          <Image
            src="/eventio/auth/login-hero.avif"
            alt=""
            fill
            className="object-cover opacity-[0.11]"
            priority
          />
        </div>
        <div className="absolute left-[61px] top-[39px] z-10 text-white">
          <LogoMark />
        </div>
        <div className="absolute left-1/2 top-[calc(100vh-244px)] z-10 w-[310px] -translate-x-1/2 text-center">
          <p className="font-(--font-eventio-serif) text-[36px] leading-[42px] text-white">
            &quot;Great, kid. Don&apos;t get cocky!&quot;
          </p>
          <div className="mx-auto mt-5 h-[2px] w-[12px] bg-brand" />
          <p className="mt-3 text-[18px] leading-6 text-white/60">
            Han Solo
          </p>
        </div>
      </aside>

      <div className="min-h-screen w-full lg:pl-[480px]">
        <section className="relative min-h-screen px-6">
          <div className="absolute left-6 top-[29px] text-text lg:hidden">
            <LogoMark className="h-[22px] w-[23px]" />
          </div>

          <div className="fixed right-[39px] top-10 z-20 hidden lg:block">
            <p className="text-[14px] leading-6 text-muted">
              Don&apos;t have account?
              <Link
                href="/signup"
                className="ml-1 font-semibold tracking-[1px] text-text hover:underline"
              >
                SIGN UP
              </Link>
            </p>
          </div>

          <div className="mx-auto grid min-h-screen w-full max-w-[320px] place-items-center lg:max-w-[480px]">
            <div className="w-full">
              <div className="text-center lg:text-left">
                <h1 className="text-[22px] font-normal leading-[48px] text-text lg:text-[28px]">
                  Sign in to Eventio.
                </h1>
                <p className="text-[14px] leading-6 text-muted lg:text-[18px]">
                  Enter your details below.
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

