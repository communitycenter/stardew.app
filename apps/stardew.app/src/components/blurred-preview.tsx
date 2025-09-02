import { AnimalCard } from "@/components/cards/animal-card";
import { HorseCard } from "@/components/cards/horse-card";
import { InfoCard } from "@/components/cards/info-card";
import { IconHome, IconPaw } from "@tabler/icons-react";

export function BlurredPreview() {
	return (
		<div className="absolute inset-0 overflow-hidden opacity-40 blur-md pointer-events-none select-none">
			<div className="space-y-4 p-4">
				{/* Sample Statistics */}
				<section className="space-y-3">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						<InfoCard title="Total Animals" description="12" Icon={IconHome} />
						<InfoCard title="Max Friendship" description="8" Icon={IconPaw} />
						<InfoCard title="Coop Animals" description="6" Icon={IconHome} />
						<InfoCard title="Barn Animals" description="6" Icon={IconHome} />
					</div>
				</section>

				{/* Sample Animal Cards */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					<AnimalCard
						animal={{
							name: "Moo Moo",
							type: "Brown Cow",
							age: 45,
							friendship: 800,
							happiness: 200,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/f/fd/Brown_Cow.png"
					/>
					<AnimalCard
						animal={{
							name: "Clucky",
							type: "Chicken",
							age: 23,
							friendship: 1000,
							happiness: 255,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/2/22/White_Chicken.png"
					/>
					<AnimalCard
						animal={{
							name: "Whiskers",
							type: "Cat",
							friendship: 650,
						}}
						type="pet"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/8/8a/Cat.png"
					/>
					<AnimalCard
						animal={{
							name: "Quackers",
							type: "Duck",
							age: 67,
							friendship: 750,
							happiness: 180,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/3/38/Duck.png"
					/>
					<AnimalCard
						animal={{
							name: "Baa Baa",
							type: "Sheep",
							age: 34,
							friendship: 900,
							happiness: 220,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/1/1a/Sheep.png"
					/>
					<AnimalCard
						animal={{
							name: "Oinkers",
							type: "Pig",
							age: 89,
							friendship: 950,
							happiness: 240,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/4/4a/Pig.png"
					/>
					<AnimalCard
						animal={{
							name: "Bleaty",
							type: "Goat",
							age: 56,
							friendship: 850,
							happiness: 190,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/0/0a/Goat.png"
					/>
					<AnimalCard
						animal={{
							name: "Bouncy",
							type: "Rabbit",
							age: 12,
							friendship: 600,
							happiness: 150,
						}}
						type="farm"
						imageUrl="https://stardewvalleywiki.com/mediawiki/images/f/fd/Rabbit.png"
					/>
					<HorseCard horseName="Thunder" />
				</div>
			</div>
		</div>
	);
}
