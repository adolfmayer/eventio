import Link from "next/link";

import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto w-full max-w-[480px] px-6 py-20">
        <div className="text-center lg:text-left">
          <Link href="/login" className="text-[14px] leading-6 text-muted hover:underline">
            Back to sign in
          </Link>
          <h1 className="mt-6 text-[22px] font-normal leading-[48px] text-text lg:text-[28px]">
            Create a new password
          </h1>
          <p className="text-[14px] leading-6 text-muted lg:text-[18px]">
            Enter your new password below.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  );
}

