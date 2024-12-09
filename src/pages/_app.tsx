import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/sidebar";
import { Topbar, User } from "@/components/top-bar";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayersProvider } from "@/contexts/players-context";
import { PreferencesProvider } from "@/contexts/preferences-context";

import { useEffect, useState } from "react";
import useSWR from "swr";
import ErrorBoundary from "@/components/error-boundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GeistSans } from "geist/font/sans";
import { AppSidebar } from "@/components/sidebar/main";

export default function App({ Component, pageProps }: AppProps) {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false },
  );
  const [hasIdentified, setHasIdentified] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlayersProvider>
        <PreferencesProvider>
          <div className={GeistSans.className}>
            <div className="sticky top-0 z-10 dark:bg-neutral-950">
              <Topbar />
            </div>
            <div>
              <Sidebar className="hidden max-h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] overflow-y-auto overflow-x-clip md:fixed md:flex md:w-72 md:flex-col" />
              <div className="md:pl-72">
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
                <Toaster richColors />
              </div>
            </div>
          </div>
        </PreferencesProvider>
      </PlayersProvider>
    </ThemeProvider>
  );
}
