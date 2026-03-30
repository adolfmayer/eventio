"use client";

import * as React from "react";
import { Toaster } from "sonner";

type ThemeMode = "light" | "dark";

function readThemeFromDom(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function SonnerToaster() {
  const [theme, setTheme] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    const update = () => setTheme(readThemeFromDom());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} position="top-right" closeButton />;
}

