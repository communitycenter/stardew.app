import Image from "next/image";

import type { Achievement } from "@/types/items";

import { usePlayers } from "@/contexts/players-context";
import { cn } from "@/lib/utils";

interface Props {
	achievement: Achievement;
	additionalDescription?: string;
	completed: boolean;
}

export const AchievementCard = ({
	achievement,
	additionalDescription,
	completed,
}: Props) => {
	const { activePlayer, patchPlayer } = usePlayers();

	// `completed` reflects derived stats (e.g. bundles finished, fish caught).
	// Manual completion can only add on top of that, since a derived-true
	// achievement can't be un-completed by editing the achievements list.
	const derivedCompleted = completed;
	const manuallyCompleted = !!(
		activePlayer?.general?.achievements &&
		achievement.gameID &&
		activePlayer.general.achievements.includes(achievement.gameID)
	);
	const isCompleted = derivedCompleted || manuallyCompleted;
	const canToggle = !derivedCompleted && !!achievement.gameID;

	function handleClick() {
		if (!canToggle || !achievement.gameID) return;

		const achievements = activePlayer?.general?.achievements ?? [];
		const nextAchievements = manuallyCompleted
			? achievements.filter((id) => id !== achievement.gameID)
			: [...achievements, achievement.gameID];

		void patchPlayer({ general: { achievements: nextAchievements } });
	}

	let checkedClass = isCompleted
		? "border-green-900 bg-green-500/20 dark:bg-green-500/10"
		: "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950";
	if (canToggle) {
		checkedClass += isCompleted
			? " hover:bg-green-500/30 hover:dark:bg-green-500/20 hover:cursor-pointer"
			: " hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:cursor-pointer";
	}

	return (
		<div
			className={cn(
				"flex select-none items-center space-x-3 rounded-lg border px-5 py-4 text-neutral-950 shadow-sm transition-colors dark:text-neutral-50",
				checkedClass,
			)}
			onClick={canToggle ? handleClick : undefined}
			role={canToggle ? "button" : undefined}
			aria-pressed={canToggle ? isCompleted : undefined}
		>
			<Image
				src={achievement.iconURL}
				alt={achievement.name}
				className={isCompleted ? "rounded-sm" : "rounded-sm grayscale"}
				width={48}
				height={48}
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{achievement.name}</p>
				<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
					{achievement.description + (additionalDescription ?? "")}
				</p>
			</div>
		</div>
	);
};
