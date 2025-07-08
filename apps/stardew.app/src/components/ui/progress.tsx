import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max, ...props }, ref) => (
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
        className="h-full w-full flex-1 bg-neutral-900 transition-all dark:bg-neutral-50"
        style={{
          transform: `translateX(-${100 - (value && max ? (value / max) * 100 : 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
    <span className="flex text-sm">
      {typeof value === "number" && typeof max === "number"
        ? `${value} / ${max}`
        : ``}
    </span>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
