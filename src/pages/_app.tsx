import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/sidebar";
import { Topbar, User } from "@/components/top-bar";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayersProvider } from "@/contexts/players-context";
import { PreferencesProvider } from "@/contexts/preferences-context";

import posthog from "posthog-js";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ErrorBoundary from "@/components/error-boundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GeistSans } from "geist/font/sans";
import { AppSidebar } from "@/components/sidebar/main";

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    ui_host: "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(false); // debug mode in development
    },
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false },
  );
  const [hasIdentified, setHasIdentified] = useState(false);

  useEffect(() => {
    if (api.data && !hasIdentified) {
      posthog.identify(api.data.id, {
        $name: api.data.discord_name,
        $username: api.data.discord_name,
      });
      console.log("Identified user", api.data.id, api.data.discord_name);
      setHasIdentified(true);
    }

    return;
  }, [api.data]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlayersProvider>
        <PreferencesProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <main>
                <ErrorBoundary>
                  <main className={GeistSans.className}>
                    <Component {...pageProps} />
                  </main>
                </ErrorBoundary>
                <Toaster richColors />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </PreferencesProvider>
      </PlayersProvider>
    </ThemeProvider>
  );
}
