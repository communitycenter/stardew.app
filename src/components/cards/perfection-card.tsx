import { PercentageIndicator } from "@/components/percentage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	title: string;
	description: string;
	percentage: number;
	footer: string;
	[rest: string]: any;
}

export const PerfectionCard = ({
	title,
	description,
	percentage,
	footer,
	...rest
}: Props) => {
	const checkedClass =
		percentage === 100
			? "border-green-900 bg-green-500/20 dark:bg-green-500/10 dark:border-green-900"
			: "";
	return (
		<Card {...rest} className={checkedClass}>
			<div className="grid grid-cols-3">
				<div className="col-span-2 flex flex-col">
					<CardHeader className="items-cnter flex flex-row justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-semibold">{title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{description}</p>
						<p className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
							{footer}
						</p>
					</CardContent>
				</div>
				<div className="flex items-center justify-end p-5">
					<PercentageIndicator percentage={percentage} className="h-16 w-16" />
				</div>
			</div>
		</Card>
	);
};
