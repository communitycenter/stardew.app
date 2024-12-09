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
