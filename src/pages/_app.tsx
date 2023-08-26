import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Topbar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayersProvider } from "@/contexts/players-context";

import * as Fathom from "fathom-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    Fathom.load("RZGVBJOJ", {
      includedDomains: ["stardew.app"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlayersProvider>
        <div className={`${inter.className}`}>
          <div className="sticky top-0 z-10 dark:bg-neutral-950">
            <Topbar />
          </div>
          <div className="">
            <Sidebar className="hidden md:flex md:fixed md:w-72 md:flex-col" />
            <div className="md:pl-72">
              <Component {...pageProps} />
              <Toaster />
            </div>
          </div>
        </div>
      </PlayersProvider>
    </ThemeProvider>
  );
}
