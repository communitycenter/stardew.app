import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HorseCardProps {
	horseName?: string;
}

export function HorseCard({ horseName }: HorseCardProps) {
	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-medium">
						{horseName || "Unnamed Horse"}
					</CardTitle>
					<Badge className="bg-brown-100 text-brown-800 dark:bg-brown-900 dark:text-brown-200">
						Horse
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="text-sm text-muted-foreground">
					Your trusty steed for faster travel around Stardew Valley.
				</div>
				<div className="space-y-2">
					<div className="text-xs text-muted-foreground">
						• Increases movement speed by 30%
					</div>
					<div className="text-xs text-muted-foreground">
						• Can be fed carrots once per day
					</div>
					<div className="text-xs text-muted-foreground">
						• Can wear hats for customization
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
