import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { IconSparkles } from "@tabler/icons-react";

export const CHANGELOG_VERSION = "v2.4.0";
const CHANGELOG_DATE = "April 2026";

// Set to null to hide the message section entirely.
const CC_MESSAGE: string | null =
	"These features were developed by the community, for the community. Thank you for your continued support and feedback on the tool - we couldn’t do it without you!";
const CHANGELOG_ENTRIES: {
	title: string;
	description: string;
	type: "new" | "fix" | "improvement";
}[] = [
	{
		title: "Grandpa's Evaluation",
		description:
			"New page to track your Year 3 evaluation score and candle count. Grandpa even smiles if you earn all four candles.",
		type: "new",
	},
	{
		title: "Skills Editing",
		description:
			"Edit your skill levels and mastery progress directly from the player editor.",
		type: "new",
	},
	{
		title: "What's New dialog",
		description:
			"You're reading it! A changelog dialog so we can keep you in the loop on updates.",
		type: "new",
	},
	{
		title: "Bundle Season Filter",
		description: "Filter bundle items by season to plan your hauls.",
		type: "improvement",
	},
	{
		title: "Golden Walnut Counts",
		description: "Multi-walnut goals now show tracking with a +/- counter.",
		type: "improvement",
	},
	{
		title: "1.6 Content Unblurred",
		description:
			"Removed the opt-in spoiler gate for 1.6 content — all items now show unconditionally.",
		type: "improvement",
	},
	{
		title: "Sidebar Sticky Fix",
		description: "Fixed the sidebar not staying sticky while scrolling.",
		type: "fix",
	},
];

// ────────────────────────────────────────────────────────────────────────────

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function ChangelogDialog({ open, setOpen }: Props) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<IconSparkles size={18} className="text-yellow-400" />
						What&apos;s New: {CHANGELOG_VERSION} ({CHANGELOG_DATE})
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-2.5">
					{CHANGELOG_ENTRIES.map((entry) => (
						<div
							key={entry.title}
							className="rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800"
						>
							<div className="flex items-center gap-1">
								{entry.type === "new" && (
									<span className="text-sm font-semibold italic text-green-700 dark:text-green-300">
										New!
									</span>
								)}
								{entry.type === "fix" && (
									<span className="text-sm font-semibold italic text-red-700 dark:text-red-300">
										Fixed:
									</span>
								)}
								{entry.type === "improvement" && (
									<span className="text-sm font-semibold italic text-blue-700 dark:text-blue-300">
										Improved:
									</span>
								)}
								<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
									{entry.title}
								</p>
							</div>
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								{entry.description}
							</p>
						</div>
					))}
				</div>
				{CC_MESSAGE && (
					<div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
						<p className="mb-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
							A message from the Community Center team:
						</p>
						<p className="text-sm text-neutral-700 dark:text-neutral-300">
							{CC_MESSAGE}
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
