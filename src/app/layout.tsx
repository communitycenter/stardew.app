import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { PlayersProvider } from "@/contexts/players-context";
import { PreferencesProvider } from "@/contexts/preferences-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/main";
import { SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/error-boundary";
import Script from "next/script";
import type { Metadata } from "next";

// TODO: look at dynamic metadata for pages. what's the easiest way to apply it across multiple pages
export const metadata: Metadata = {
  title: "Stardew.app",
  description:
    "Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion.",
  metadataBase: new URL("https://stardew.app"),
  openGraph: {
    type: "website",
    url: "https://stardew.app",
    title: "Stardew.app",
    description:
      "Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion.",
    images: [
      {
        url: "/favicon.png",
        width: 64,
        height: 64,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "stardew.app",
    description:
      "Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion.",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          data-domain="stardew.app"
          src="https://plausible.verbose.faith/js/script.js"
        />
      </head>
      <body
        className={`overscroll-y-none dark:bg-neutral-950 ${GeistSans.className}`}
      >
        {/* EVERY SINGLE ONE OF THESE PROVIDERS PROBABLY NEEDS TO GET KILLED */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PlayersProvider>
            <PreferencesProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <main>
                    <ErrorBoundary>
                      <main>{children}</main>
                    </ErrorBoundary>
                    <Toaster richColors />
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </PreferencesProvider>
          </PlayersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
