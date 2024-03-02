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
import { PostHogProvider } from "posthog-js/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
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
          <PostHogProvider client={posthog}>
            <div className={`${inter.className}`}>
              <div className="sticky top-0 z-10 dark:bg-neutral-950">
                <Topbar />
              </div>
              <div>
                <Sidebar className="hidden max-h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] overflow-y-auto overflow-x-clip md:fixed md:flex md:w-72 md:flex-col" />
                <div className="md:pl-72">
                  <Component {...pageProps} />
                  <Toaster richColors />
                </div>
              </div>
            </div>
          </PostHogProvider>
        </PreferencesProvider>
      </PlayersProvider>
    </ThemeProvider>
  );
}
