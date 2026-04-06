import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/sidebar";
import { Topbar, User } from "@/components/top-bar";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { MultiSelectProvider } from "@/contexts/multi-select-context";
import { PlayersProvider } from "@/contexts/players-context";
import { PreferencesProvider } from "@/contexts/preferences-context";
import { fetchJson } from "@/lib/fetch";

import ErrorBoundary from "@/components/error-boundary";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const api = useSWR<User>(
		"/api/me",
		fetchJson<User>,
		{ refreshInterval: 0, revalidateOnFocus: false },
	);

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<PlayersProvider>
				<PreferencesProvider>
					<MultiSelectProvider>
						<div className={`${inter.className}`}>
							<div className="fixed top-0 z-10 w-full bg-white dark:bg-neutral-950">
								<Topbar />
							</div>
							<div className="pt-[65px]">
								<Sidebar className="hidden max-h-[calc(100vh-65px)] overflow-y-auto overflow-x-clip md:fixed md:top-[65px] md:flex md:w-72 md:flex-col" />
								<div className="md:pl-72">
									<ErrorBoundary>
										<Component {...pageProps} />
									</ErrorBoundary>
									<Toaster richColors />
								</div>
							</div>
						</div>
					</MultiSelectProvider>
				</PreferencesProvider>
			</PlayersProvider>
		</ThemeProvider>
	);
}
