import type { Metadata } from "next";
import { Hind, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";

import { SonnerToaster } from "@/components/sonner-toaster";
import { ToastBridge } from "@/components/toast-bridge";

const eventioSans = Hind({
  variable: "--font-eventio-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const eventioSerif = Playfair_Display({
  variable: "--font-eventio-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Eventio",
    template: "%s · Eventio",
  },
  description: "Discover, create, and join events with Eventio.",
  openGraph: {
    title: "Eventio",
    description: "Discover, create, and join events with Eventio.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventio",
    description: "Discover, create, and join events with Eventio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${eventioSans.variable} ${eventioSerif.variable} h-full antialiased`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='eventio.theme';var raw=localStorage.getItem(key);var theme=(raw==='dark'||raw==='light')?raw:'light';document.documentElement.dataset.theme=theme;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-text">
        <SonnerToaster />
        <Suspense fallback={null}>
          <ToastBridge />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
