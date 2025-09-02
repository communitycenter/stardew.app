import { BlurredPreview } from "@/components/blurred-preview";
import { AnimalCard } from "@/components/cards/animal-card";
import { InfoCard } from "@/components/cards/info-card";
import { UploadDialog } from "@/components/dialogs/upload-dialog";
import { FilterSearch } from "@/components/filter-btn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePlayers } from "@/contexts/players-context";
import { AnimalsData, FarmAnimal, Pet } from "@/types/data";
import {
	IconAlertCircle,
	IconHeart,
	IconHome,
	IconMoodHappy,
	IconPaw,
	IconUpload,
} from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";

const animalTypes = [
	{ value: "all", label: "All Animals" },
	{ value: "coop", label: "Coop Animals" },
	{ value: "barn", label: "Barn Animals" },
	{ value: "pets", label: "Pets" },
];

const sortOptions = [
	{ value: "name", label: "Name" },
	{ value: "friendship", label: "Friendship" },
	{ value: "happiness", label: "Happiness" },
	{ value: "age", label: "Age" },
];

const friendshipLevels = [
	{ value: "all", label: "All Friendship" },
	{ value: "max", label: "Max (1000)" },
	{ value: "very-happy", label: "Very Happy (800+)" },
	{ value: "happy", label: "Happy (600+)" },
	{ value: "neutral", label: "Neutral (400+)" },
	{ value: "unhappy", label: "Unhappy (200+)" },
	{ value: "very-unhappy", label: "Very Unhappy (<200)" },
];

const happinessLevels = [
	{ value: "all", label: "All Happiness" },
	{ value: "max", label: "Max (255)" },
	{ value: "very-happy", label: "Very Happy (200+)" },
	{ value: "happy", label: "Happy (150+)" },
	{ value: "neutral", label: "Neutral (100+)" },
	{ value: "unhappy", label: "Unhappy (50+)" },
	{ value: "very-unhappy", label: "Very Unhappy (<50)" },
];

const coopAnimals = [
	"Chicken",
	"Brown Chicken",
	"Blue Chicken",
	"Void Chicken",
	"Golden Chicken",
	"Duck",
	"Rabbit",
	"Dinosaur",
];

const barnAnimals = [
	"Cow",
	"Brown Cow",
	"White Cow",
	"Goat",
	"Sheep",
	"Pig",
	"Ostrich",
];

export default function Animals() {
	const { activePlayer } = usePlayers();
	const [animalsData, setAnimalsData] = useState<AnimalsData | null>(null);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [sortBy, setSortBy] = useState("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [friendshipFilter, setFriendshipFilter] = useState("all");
	const [happinessFilter, setHappinessFilter] = useState("all");
	const [uploadOpen, setUploadOpen] = useState(false);

	// Check if this user has uploaded a save file (not manually created)
	const hasUploadedSave = activePlayer?.general?.platform !== undefined;

	// Check if this is a PC save (if they have uploaded a save)
	const isPCSave = activePlayer?.general?.platform === "PC";

	// Check if they have animal data (not just empty object)
	const hasAnimalData =
		activePlayer?.animals && Object.keys(activePlayer.animals).length > 0;

	// Animal image URLs - you can replace these with your external URLs
	const animalImages: Record<string, string> = {
		// Coop Animals
		"Chicken": "https://cdn.stardew.app/images/(MISC)Chicken.webp",
		"Brown Chicken": "https://cdn.stardew.app/images/(MISC)Brown_Chicken.webp",
		"Blue Chicken": "https://cdn.stardew.app/images/(MISC)Blue_Chicken.webp",
		"Void Chicken": "https://cdn.stardew.app/images/(MISC)Void_Chicken.webp",
		"Golden Chicken":
			"https://cdn.stardew.app/images/(MISC)Golden_Chicken.webp",
		"Duck": "https://cdn.stardew.app/images/(MISC)Duck.webp",
		"Rabbit": "https://cdn.stardew.app/images/(MISC)Rabbit.webp",
		"Dinosaur": "https://cdn.stardew.app/images/(MISC)Dinosaur.webp",

		// Barn Animals
		"Cow": "https://cdn.stardew.app/images/(MISC)Cow.webp",
		"Brown Cow": "https://cdn.stardew.app/images/(MISC)Brown_Cow.webp",
		"White Cow": "https://cdn.stardew.app/images/(MISC)White_Cow.webp",
		"Goat": "https://cdn.stardew.app/images/(MISC)Goat.webp",
		"Sheep": "https://cdn.stardew.app/images/(MISC)Sheep.webp",
		"Pig": "https://cdn.stardew.app/images/(MISC)Pig.webp",
		"Ostrich": "https://cdn.stardew.app/images/(MISC)Ostrich.webp",

		// Pets
		"Cat": "https://cdn.stardew.app/images/(MISC)Cat_2.webp",
		"Dog": "https://cdn.stardew.app/images/(MISC)Dog_1.webp",
		"Turtle": "https://cdn.stardew.app/images/(MISC)Turtle.webp",
	};

	useEffect(() => {
		if (activePlayer?.animals) {
			setAnimalsData(activePlayer.animals as AnimalsData);
		}
	}, [activePlayer]);

	const getImageUrl = (animalType: string) => {
		// Normalize type names for image lookup
		if (animalType === "White Chicken") return animalImages["Chicken"];
		if (animalType === "White Cow") return animalImages["Cow"];
		return animalImages[animalType];
	};

	const filterAndSortAnimals = (
		animals: (FarmAnimal | Pet)[],
		type: "farm" | "pet",
	) => {
		let filtered = animals.filter((animal) => {
			// Search filter
			if (search && !animal.name.toLowerCase().includes(search.toLowerCase())) {
				return false;
			}

			// Type filter
			if (filter === "coop") {
				return type === "farm" && coopAnimals.includes(animal.type);
			}
			if (filter === "barn") {
				return type === "farm" && barnAnimals.includes(animal.type);
			}
			if (filter === "pets") {
				return type === "pet";
			}
			if (filter === "horse") {
				return false; // Horse is handled separately
			}

			// Friendship filter
			if (friendshipFilter !== "all") {
				const friendship = animal.friendship;
				switch (friendshipFilter) {
					case "max":
						if (friendship < 1000) return false;
						break;
					case "very-happy":
						if (friendship < 800) return false;
						break;
					case "happy":
						if (friendship < 600) return false;
						break;
					case "neutral":
						if (friendship < 400) return false;
						break;
					case "unhappy":
						if (friendship < 200) return false;
						break;
					case "very-unhappy":
						if (friendship >= 200) return false;
						break;
				}
			}

			// Happiness filter (only for farm animals)
			if (happinessFilter !== "all" && type === "farm") {
				const happiness = (animal as FarmAnimal).happiness;
				switch (happinessFilter) {
					case "max":
						if (happiness < 255) return false;
						break;
					case "very-happy":
						if (happiness < 200) return false;
						break;
					case "happy":
						if (happiness < 150) return false;
						break;
					case "neutral":
						if (happiness < 100) return false;
						break;
					case "unhappy":
						if (happiness < 50) return false;
						break;
					case "very-unhappy":
						if (happiness >= 50) return false;
						break;
				}
			}

			return true; // "all" filter
		});

		// Sort the filtered animals
		return filtered.sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (sortBy) {
				case "name":
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case "friendship":
					aValue = a.friendship;
					bValue = b.friendship;
					break;
				case "happiness":
					// Only farm animals have happiness
					aValue = type === "farm" ? (a as FarmAnimal).happiness : 0;
					bValue = type === "farm" ? (b as FarmAnimal).happiness : 0;
					break;
				case "age":
					// Only farm animals have age
					aValue = type === "farm" ? (a as FarmAnimal).age : 0;
					bValue = type === "farm" ? (b as FarmAnimal).age : 0;
					break;
				default:
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortOrder === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			} else {
				return sortOrder === "asc"
					? (aValue as number) - (bValue as number)
					: (bValue as number) - (aValue as number);
			}
		});
	};

	const getTotalAnimals = () => {
		if (!animalsData) return 0;
		return (
			animalsData.farmAnimals.length +
			animalsData.pets.length +
			(animalsData.horse ? 1 : 0)
		);
	};

	const getCoopAnimalsCount = () => {
		if (!animalsData) return 0;
		return animalsData.farmAnimals.filter((animal) =>
			coopAnimals.includes(animal.type),
		).length;
	};

	const getBarnAnimalsCount = () => {
		if (!animalsData) return 0;
		return animalsData.farmAnimals.filter((animal) =>
			barnAnimals.includes(animal.type),
		).length;
	};

	const getPetsCount = () => {
		if (!animalsData) return 0;
		return animalsData.pets.length;
	};

	const getMaxFriendshipAnimals = () => {
		if (!animalsData) return 0;
		const maxFarmAnimals = animalsData.farmAnimals.filter(
			(animal) => animal.friendship >= 1000,
		).length;
		const maxPets = animalsData.pets.filter(
			(pet) => pet.friendship >= 1000,
		).length;
		return maxFarmAnimals + maxPets;
	};

	return (
		<>
			<Head>
				<title>Stardew Valley Animals Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Animals Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track your Stardew Valley animals progress. Monitor your farm animals, pets, and horse. Keep track of friendship levels, happiness, and animal care to optimize your farm's productivity."
				/>
				<meta
					name="og:description"
					content="Track your Stardew Valley animals progress. Monitor your farm animals, pets, and horse. Keep track of friendship levels, happiness, and animal care to optimize your farm's productivity."
				/>
				<meta
					name="twitter:description"
					content="Track your Stardew Valley animals progress. Monitor your farm animals, pets, and horse. Keep track of friendship levels, happiness, and animal care to optimize your farm's productivity."
				/>
				<meta
					name="keywords"
					content="stardew valley animals tracker, stardew valley farm animals, stardew valley pets, stardew valley horse, stardew valley animal friendship, stardew valley animal happiness, stardew valley animal care, stardew valley coop animals, stardew valley barn animals, stardew valley animal productivity, stardew valley, stardew, stardew animals, stardew farm, stardew pets"
				/>
			</Head>
			<main className="flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8">
				<div className="mx-auto mt-4 w-full space-y-4">
					<div className="flex flex-row items-center gap-2">
						<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
							Animals Tracker
						</h1>
						<Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 align-middle">
							Beta
						</Badge>
					</div>

					{/* Access Control Messages */}
					{!hasUploadedSave && (
						<div className="relative flex min-h-[calc(100vh-250px)] w-full items-center justify-center">
							<BlurredPreview />

							{/* Foreground Alert */}
							<div className="relative z-10 w-full max-w-2xl rounded-lg border border-blue-200 bg-blue-50/95 p-6 dark:border-blue-800 dark:bg-blue-900/95 backdrop-blur-sm flex flex-col items-start">
								<div className="flex flex-row items-center justify-center gap-2">
									<IconPaw className="h-10 w-10 text-blue-500" />
									<h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
										Please upload your save file!
									</h2>
								</div>
								<div className="w-full mt-2">
									<div className="py-2 text-lg text-blue-700 dark:text-blue-300 font-semibold">
										Don&apos;t have a save file?
									</div>
									<div className="text-md text-blue-600 dark:text-blue-400">
										<p>
											The animals tracker is designed to read data directly from
											your Stardew Valley save file. This feature wouldn&apos;t
											be useful to users who can&apos;t upload their save
											because it tracks real animal data like friendship levels,
											happiness, and ages that are specific to your farm.
										</p>
										<p className="mt-2">
											If you&apos;re playing on PC, you can find your save files
											in your Stardew Valley folder. For mobile players, save
											file access depends on your device and platform.
										</p>
										<p className="mt-2">
											If you believe you&apos;d find the manual animal tracker
											useful, please reach out to us on{" "}
											<a
												href="https://stardew.app/discord"
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-700 dark:text-blue-300"
											>
												Discord
											</a>
											, and ping Jack (@lafond) and let him know!
										</p>
										<p className="mt-2">- the Community Center Team</p>
									</div>
									<div className="mt-6 flex justify-end">
										<Button
											onClick={() => setUploadOpen(true)}
											className="bg-blue-600 hover:bg-blue-700 text-white"
										>
											<IconUpload className="h-4 w-4 mr-2" />
											Upload Save File
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{hasUploadedSave && !hasAnimalData && (
						<div className="relative flex min-h-[calc(100vh-250px)] w-full items-center justify-center">
							<BlurredPreview />

							{/* Foreground Alert */}
							<div className="relative z-10 w-full max-w-2xl rounded-lg border border-blue-200 bg-blue-50/95 p-6 dark:border-blue-800 dark:bg-blue-900/95 backdrop-blur-sm flex flex-col items-start">
								<div className="flex flex-row items-center justify-center gap-2">
									<IconAlertCircle className="h-10 w-10 text-blue-500" />
									<h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
										Re-upload Required
									</h2>
								</div>
								<div className="w-full mt-2">
									<div className="text-lg text-blue-600 dark:text-blue-400">
										<p>
											Your save file was uploaded before animal tracking was
											added. Please re-upload your save file to see your animal
											data.
										</p>
									</div>
									<div className="mt-6 flex justify-end">
										<Button
											onClick={() => setUploadOpen(true)}
											className="bg-blue-600 hover:bg-blue-700 text-white"
										>
											<IconUpload className="h-4 w-4 mr-2" />
											Re-upload Save File
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Main Content - Only show for uploaded saves with animal data */}
					{hasUploadedSave && hasAnimalData && (
						<>
							{/* Statistics Section */}
							<section className="space-y-3">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
									<InfoCard
										title="Total Animals"
										description={getTotalAnimals().toString()}
										Icon={IconHome}
									/>
									<InfoCard
										title="Max Friendship"
										description={getMaxFriendshipAnimals().toString()}
										Icon={IconPaw}
									/>
									<InfoCard
										title="Coop Animals"
										description={getCoopAnimalsCount().toString()}
										Icon={IconHome}
									/>
									<InfoCard
										title="Barn Animals"
										description={getBarnAnimalsCount().toString()}
										Icon={IconHome}
									/>
								</div>
							</section>

							{/* Filters and Search */}
							<div className="space-y-3">
								<div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div className="flex flex-row items-center gap-2">
										<ToggleGroup
											variant="outline"
											type="single"
											value={filter}
											onValueChange={(val) => setFilter(val || "all")}
											className="gap-2"
										>
											{animalTypes.map((type) => (
												<ToggleGroupItem key={type.value} value={type.value}>
													{type.label}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</div>
									<div className="flex flex-row items-center gap-2 md:ml-4 md:justify-between">
										<FilterSearch
											title="Friendship"
											_filter={friendshipFilter}
											data={friendshipLevels}
											icon={IconHeart}
											setFilter={setFriendshipFilter}
										/>
										<FilterSearch
											title="Happiness"
											_filter={happinessFilter}
											data={happinessLevels}
											icon={IconMoodHappy}
											setFilter={setHappinessFilter}
										/>
									</div>
								</div>

								{/* Search Bar */}
								<div className="w-full">
									<Command className="w-full border border-b-0 dark:border-neutral-800">
										<CommandInput
											onValueChange={(v) => setSearch(v)}
											placeholder="Search animals..."
										/>
									</Command>
								</div>
							</div>

							{/* Animals Grid */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
								{/* Farm Animals */}
								{animalsData &&
									filterAndSortAnimals(animalsData.farmAnimals, "farm").map(
										(animal) => (
											<AnimalCard
												key={`farm-${animal.name}`}
												animal={animal}
												type="farm"
												imageUrl={getImageUrl(animal.type)}
											/>
										),
									)}
								{/* Pets */}
								{animalsData &&
									filterAndSortAnimals(animalsData.pets, "pet").map((pet) => (
										<AnimalCard
											key={`pet-${pet.name}`}
											animal={pet}
											type="pet"
											imageUrl={getImageUrl(pet.type)}
										/>
									))}

								{/* Horse - Kind of a stupid card to show off in the UI so we'll skip it for now
								{animalsData?.horse &&
									(filter === "all" || filter === "horse") && (
										<HorseCard horseName={animalsData.horse} />
									)} */}
							</div>

							{/* Empty State */}
							{animalsData && getTotalAnimals() === 0 && (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<IconPaw className="h-12 w-12 text-muted-foreground mb-4" />
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
										No Animals Found
									</h3>
									<p className="text-muted-foreground">
										Upload a save file to see your animals, or start a new farm
										to begin your animal collection.
									</p>
								</div>
							)}

							{/* No Data State */}
							{!animalsData && (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<IconPaw className="h-12 w-12 text-muted-foreground mb-4" />
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
										No Save Data
									</h3>
									<p className="text-muted-foreground">
										Upload a save file to track your animals and their progress.
									</p>
								</div>
							)}
						</>
					)}
				</div>
			</main>
			<UploadDialog open={uploadOpen} setOpen={setUploadOpen} />
		</>
	);
}
