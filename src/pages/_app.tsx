import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Topbar } from "@/components/top-bar";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`${inter.className}`}>
        <Topbar />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
