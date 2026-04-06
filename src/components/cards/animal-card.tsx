import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FarmAnimal, Pet } from "@/types/data";
import Image from "next/image";

interface AnimalCardProps {
	animal: FarmAnimal | Pet;
	type: "farm" | "pet";
	imageUrl?: string;
}

export function AnimalCard({ animal, type, imageUrl }: AnimalCardProps) {
	const isFarmAnimal = type === "farm";
	const farmAnimal = isFarmAnimal ? (animal as FarmAnimal) : null;

	const getLevelInfo = (
		value: number,
		max: number,
		type: "friendship" | "happiness",
	) => {
		const percentage = (value / max) * 100;

		if (percentage >= 100) return { level: "Max", color: "bg-green-500" };
		if (percentage >= 80) return { level: "Very Happy", color: "bg-green-400" };
		if (percentage >= 60) return { level: "Happy", color: "bg-yellow-400" };
		if (percentage >= 40) return { level: "Neutral", color: "bg-yellow-500" };
		if (percentage >= 20) return { level: "Unhappy", color: "bg-orange-500" };
		return { level: "Very Unhappy", color: "bg-red-500" };
	};

	const friendshipInfo = getLevelInfo(animal.friendship, 1000, "friendship");
	const happinessInfo = farmAnimal
		? getLevelInfo(farmAnimal.happiness, 255, "happiness")
		: null;

	const getAnimalTypeColor = (animalType: string) => {
		const colors: Record<string, string> = {
			// Coop Animals
			"Chicken":
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
			"Brown Chicken":
				"bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
			"Blue Chicken":
				"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
			"Void Chicken":
				"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
			"Golden Chicken":
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
			"Duck":
				"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
			"Rabbit": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
			"Dinosaur": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",

			// Barn Animals
			"Cow": "bg-white text-black dark:bg-gray-800 dark:text-white",
			"Brown Cow":
				"bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
			"White Cow":
				"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
			"Goat":
				"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
			"Sheep": "bg-white text-black dark:bg-gray-800 dark:text-white",
			"Pig": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
			"Ostrich":
				"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",

			// Pets
			"Cat":
				"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
			"Dog":
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
			"Turtle":
				"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
		};

		return (
			colors[animalType] ||
			"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
		);
	};

	const getDisplayType = (animalType: string) => {
		// Normalize type names for display
		if (animalType === "White Chicken") return "Chicken";
		if (animalType === "White Cow") return "Cow";
		return animalType;
	};

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Image
							src={imageUrl || ""}
							alt={animal.type}
							width={32}
							height={32}
							className="rounded-sm"
						/>
						<CardTitle className="text-lg font-medium truncate">
							{animal.name}
						</CardTitle>
					</div>
					<Badge className={cn("text-xs", getAnimalTypeColor(animal.type))}>
						{getDisplayType(animal.type)}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{/* Age (for farm animals) */}
				{farmAnimal && (
					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Age</span>
							<span className="font-medium">{farmAnimal.age} days</span>
						</div>
					</div>
				)}

				{/* Friendship */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className={cn("h-2 w-2 rounded-full", friendshipInfo.color)}
							/>
							<span className="text-sm font-medium">Friendship</span>
						</div>
						<span className="text-sm text-muted-foreground">
							{animal.friendship}/1000
						</span>
					</div>
					<Progress
						value={animal.friendship}
						max={1000}
						className="h-2"
						color={friendshipInfo.color}
					/>
					<div className="text-xs text-muted-foreground text-center">
						{friendshipInfo.level}
					</div>
				</div>

				{/* Happiness (for farm animals) */}
				{farmAnimal && happinessInfo && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div
									className={cn("h-2 w-2 rounded-full", happinessInfo.color)}
								/>
								<span className="text-sm font-medium">Happiness</span>
							</div>
							<span className="text-sm text-muted-foreground">
								{farmAnimal.happiness}/255
							</span>
						</div>
						<Progress
							value={farmAnimal.happiness}
							max={255}
							className="h-2"
							color={happinessInfo.color}
						/>
						<div className="text-xs text-muted-foreground text-center">
							{happinessInfo.level}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
