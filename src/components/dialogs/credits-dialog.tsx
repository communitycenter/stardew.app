import Image from "next/image";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

const CORE_CONTRIBUTORS = [
	{
		name: "Jack LaFond",
		github: "jacc",
		links: {
			website: "https://jack.bio",
			linkedin: "https://linkedin.com/in/jacklafond",
			github: "https://github.com/jacc",
		},
	},
	{
		name: "Clemente Solorio",
		github: "clxmente",
		links: {
			website: "https://www.solorio.dev/",
			linkedin: "https://linkedin.com/in/clementesolorio",
			github: "https://github.com/clxmente",
		},
	},
];

const THANKS = [
	"Blink18260000",
	"Brandon Saldan",
	"Leah Lundqvist",
	"Ian Mitchell",
	"MouseyPounds",
	"ConcernedApe",
	"SDV Wiki",
];

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const CreditsDialog = ({ open, setOpen }: Props) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-center gap-2">
						<Image
							src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
							alt="Heart icon"
							width={20}
							height={20}
						/>
						Credits
					</DialogTitle>
				</DialogHeader>

				{/* Core contributors */}
				<div className="grid grid-cols-2 gap-3">
					{CORE_CONTRIBUTORS.map((person) => (
						<div
							key={person.github}
							className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
						>
							<Image
								src={`https://github.com/${person.github}.png`}
								alt={person.name}
								width={36}
								height={36}
								className="rounded-md"
							/>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
									{person.name}
								</p>
								<div className="mt-0.5 flex items-center gap-1.5">
									<Link
										href={person.links.website}
										target="_blank"
										className="text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
									>
										<IconLink size={14} />
									</Link>
									<Link
										href={person.links.linkedin}
										target="_blank"
										className="text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
									>
										<IconBrandLinkedin size={14} />
									</Link>
									<Link
										href={person.links.github}
										target="_blank"
										className="text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
									>
										<IconBrandGithub size={14} />
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Special thanks */}
				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
						Special Thanks
					</p>
					<div className="grid grid-cols-3 gap-2">
						{THANKS.map((name) => (
							<div
								key={name}
								className="rounded-md border border-neutral-200 px-2 py-1.5 dark:border-neutral-800"
							>
								<p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
									{name}
								</p>
							</div>
						))}
						<div
							className="col-span-3 cursor-pointer rounded-md border border-neutral-200 px-2 py-1.5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
							onClick={() => toast.info("Seriously, we love you!")}
						>
							<p className="text-center text-xs text-neutral-600 dark:text-neutral-400">
								You, the user — thank you!
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<Image
						src="/dance.gif"
						alt="Dancing emoji"
						width={200}
						height={80}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
