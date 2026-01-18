import { IconPlus } from "@tabler/icons-react";

import { usePlayers } from "@/contexts/players-context";

import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "@/components/ui/button";

interface CardQuickActionsProps {
	addLabel: string;
	onAdd: () => void;
	className?: string;
	disabled?: boolean;
	variant?: ButtonProps["variant"];
	size?: ButtonProps["size"];
}

export const CardQuickActions = ({
	addLabel,
	onAdd,
	className,
	disabled = false,
	variant = "outline",
	size = "icon",
}: CardQuickActionsProps) => {
	const { activePlayer } = usePlayers();

	if (!activePlayer) return null;

	return (
		<Button
			aria-label={addLabel}
			disabled={disabled}
			size={size}
			type="button"
			variant={variant}
			className={cn(
				"flex-shrink-0 rounded-lg text-neutral-950 dark:text-neutral-50",
				className,
			)}
			onClick={() => {
				onAdd();
			}}
		>
			<IconPlus className="h-4 w-4" />
		</Button>
	);
};
