import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps
	extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	color?: string;
	showText?: boolean;
}

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	ProgressProps
>(({ className, value, max, color, showText = false, ...props }, ref) => (
	<div className="flex items-center space-x-2">
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				"relative flex h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20 ",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					"h-full w-full flex-1 transition-all",
					color || "bg-neutral-900 dark:bg-neutral-50",
				)}
				style={{
					transform: `translateX(-${100 - (value && max ? (value / max) * 100 : 0)}%)`,
				}}
			/>
		</ProgressPrimitive.Root>
		{showText && (
			<span className="flex text-sm">
				{typeof value === "number" && typeof max === "number"
					? `${value} / ${max}`
					: ``}
			</span>
		)}
	</div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
