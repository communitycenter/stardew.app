import {
	ArrowRight,
	CalendarClock,
	ClipboardList,
	Map,
	ScrollText,
	Users,
	type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { User } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePlayers } from "@/contexts/players-context";

import styles from "./new-site-invite.module.css";

const newSiteOrigin = (
	process.env.NEXT_PUBLIC_NEW_SITE_ORIGIN ?? "https://new.stardew.app"
).replace(/\/$/, "");
const utm = "utm_source=stardew.app&utm_medium=referral&utm_campaign=invite";
const newSiteUrl = `${newSiteOrigin}/?${utm}`;
const changelogUrl = `${newSiteOrigin}/changelog?${utm}`;

// "tried" once they've clicked through (never again), or when they said
// "maybe later" (again after a week).
const storageKey = "stardew-new-site-invite";
const remindAfterMs = 7 * 24 * 60 * 60 * 1000;

const orbitItems = [
	163, // Legend
	201, // Complete Breakfast
	60, // Emerald
	268, // Starfruit
	446, // Rabbit's Foot
	417, // Sweet Gem Berry
	72, // Diamond
	221, // Pink Cake
];

// The most-requested features on the feedback board (feedback.stardew.app)
// that the new site delivers.
const features: {
	icon: LucideIcon;
	tint: string;
	title: string;
	body: string;
}[] = [
	{
		icon: Users,
		tint: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
		title: "Multiplayer farms",
		body: "Invite your farmhands and track the same farm.",
	},
	{
		icon: ScrollText,
		tint: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
		title: "Quests and special orders",
		body: "Pierre's board, Mr. Qi's orders and the rest.",
	},
	{
		icon: ClipboardList,
		tint: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
		title: "Your own to-do list",
		body: "The Farm Board: shared to-dos and notes for your farm.",
	},
	{
		icon: Map,
		tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
		title: "A picture of your farm",
		body: "Upload a save and see your whole farm drawn out.",
	},
	{
		icon: CalendarClock,
		tint: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
		title: "Villager schedules",
		body: "Where everyone in Pelican Town is, and when.",
	},
];

const itemImage = (id: number) =>
	`https://cdn.stardew.app/images/(O)${id}.webp`;

function shouldShow() {
	try {
		const saved = localStorage.getItem(storageKey);
		if (!saved) return true;
		if (saved === "tried") return false;
		return Date.now() - Number(saved) > remindAfterMs;
	} catch {
		return false;
	}
}

function remember(value: string) {
	try {
		localStorage.setItem(storageKey, value);
	} catch {
		// Storage blocked: it just shows again next time.
	}
}

/**
 * Invites signed-in players with a farm to try the new stardew.app, once,
 * on their next visit. Replaces the old "request access" banner now that
 * the new site is open to everyone.
 */
export function NewSiteInvite({ user }: { user?: User }) {
	const { players } = usePlayers();
	const [open, setOpen] = useState(false);
	const tryRef = useRef<HTMLAnchorElement>(null);
	const hasFarm = (players?.length ?? 0) > 0;

	useEffect(() => {
		// ?invite=preview opens it for anyone, to see what it looks like.
		const preview =
			new URLSearchParams(window.location.search).get("invite") === "preview";
		if (!preview && (!user?.discord_id || !hasFarm || !shouldShow())) return;
		// A beat after the page settles, so it opens over something real.
		const timer = window.setTimeout(() => setOpen(true), 700);
		return () => window.clearTimeout(timer);
	}, [user?.discord_id, hasFarm]);

	const later = () => {
		remember(String(Date.now()));
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => (next ? setOpen(true) : later())}
		>
			<DialogContent
				// Start on the main button rather than "Maybe later".
				onOpenAutoFocus={(event) => {
					event.preventDefault();
					tryRef.current?.focus();
				}}
				className="max-h-[calc(100dvh-1.5rem)] max-w-[28rem] gap-0 overflow-y-auto overscroll-contain rounded-2xl border-0 p-0 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_24px_80px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.5)] sm:rounded-2xl"
			>
				<div
					className="relative h-40 shrink-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.22),transparent_65%),linear-gradient(to_bottom,#fbf8f1,#f5efe3)] dark:bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.14),transparent_65%),linear-gradient(to_bottom,#1c1917,#171412)] sm:h-48"
					aria-hidden
				>
					<div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(120,100,70,0.25)_1px,transparent_1px)] [background-size:16px_16px] dark:opacity-30" />
					<div className={styles.orbit}>
						{orbitItems.map((id, index) => (
							<div
								key={id}
								className={`${styles.orbiter} flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_6px_14px_-6px_rgba(60,40,10,0.35)] dark:bg-neutral-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]`}
								style={
									{
										"--orbit-index": index,
										"--orbit-count": orbitItems.length,
									} as CSSProperties
								}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={itemImage(id)}
									alt=""
									className="h-[65%] w-[65%] object-contain [image-rendering:pixelated]"
								/>
							</div>
						))}
					</div>
					<div className="absolute inset-0 z-0 flex items-center justify-center">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/brand/logo-rounded-512.png"
							alt=""
							className={`${styles.logo} h-[72px] w-[72px] drop-shadow-[0_10px_16px_rgba(60,40,10,0.3)]`}
						/>
					</div>
					<span className="absolute left-4 top-4 z-20 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-amber-950 shadow-sm">
						New
					</span>
				</div>

				<div className="space-y-5 p-6">
					<div className="space-y-2 text-center">
						<DialogTitle className="text-balance text-xl font-semibold tracking-tight">
							The new stardew.app is ready to try
						</DialogTitle>
						<DialogDescription className="text-pretty text-sm leading-6 text-neutral-600 dark:text-neutral-400">
							We&apos;ve been building a new version of stardew.app, and you can
							use it today. Sign in with Discord and your farms come with you.
							It replaces this site in a few weeks.
						</DialogDescription>
					</div>

					<div className="space-y-2.5">
						<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
							Your most-requested features are in:
						</p>
						<ul className="space-y-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900/60">
							{features.map((feature) => (
								<li key={feature.title} className="flex items-center gap-3">
									<span
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${feature.tint}`}
									>
										<feature.icon className="h-[18px] w-[18px]" aria-hidden />
									</span>
									<span className="min-w-0 flex-1">
										<span className="block text-sm font-medium leading-tight">
											{feature.title}
										</span>
										<span className="text-pretty mt-0.5 block text-xs leading-4 text-neutral-500 dark:text-neutral-400">
											{feature.body}
										</span>
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-2">
						<Button
							asChild
							size="lg"
							className="h-11 w-full rounded-xl text-[0.9375rem] transition-[background-color,transform] duration-150 active:scale-[0.97]"
						>
							<a
								ref={tryRef}
								href={newSiteUrl}
								onClick={() => remember("tried")}
							>
								Try the new stardew.app
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
							</a>
						</Button>
						<div className="flex items-center justify-center gap-1 text-sm">
							<Button
								type="button"
								variant="ghost"
								className="h-9 rounded-lg px-3 text-neutral-500 dark:text-neutral-400"
								onClick={later}
							>
								Maybe later
							</Button>
							<span
								aria-hidden
								className="h-4 w-px bg-neutral-200 dark:bg-neutral-800"
							/>
							<Button
								asChild
								variant="ghost"
								className="h-9 rounded-lg px-3 text-neutral-500 dark:text-neutral-400"
							>
								<a href={changelogUrl} target="_blank" rel="noreferrer">
									See what&apos;s new
								</a>
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
