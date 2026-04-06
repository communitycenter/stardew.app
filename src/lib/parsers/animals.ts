import { FarmAnimal, Pet } from "@/types/data";

interface AnimalsRet {
	farmAnimals: FarmAnimal[];
	pets: Pet[];
}

type Building = {
	indoors?: {
		[key: string]: any;
		animals: {
			item: Array<{ value: { FarmAnimal: any } }>;
		};
	};
};

type Character = {
	[key: string]: any;
};

export function parseAnimals(
	buildings: any,
	farmCharacters: any,
	farmHouseCharacters: any,
	prefix: string,
): AnimalsRet {
	// Handle case where buildings is not an array
	const buildingsArray = Array.isArray(buildings) ? buildings : [];

	const farmAnimals =
		buildingsArray
			.filter(
				(building: Building) =>
					building?.indoors?.[`@_${prefix}:type`] === "AnimalHouse",
			)
			// Get the arrays of animals with the required properties, and flatten them into a single one
			.flatMap((building: Building) => {
				const animals = building.indoors?.animals?.item || [];
				// Handle case where animals.item is not an array
				const animalsArray = Array.isArray(animals) ? animals : [];
				return animalsArray
					.map((animal) => {
						const animalData = animal?.value?.FarmAnimal;
						if (!animalData) return null;

						const { name, type, age, friendshipTowardFarmer, happiness } =
							animalData;
						return {
							name: name || "Unknown",
							type: type || "Unknown",
							age: age || 0,
							friendship: friendshipTowardFarmer || 0,
							happiness: happiness || 0,
						};
					})
					.filter((animal): animal is FarmAnimal => animal !== null); // Remove null entries
			}) || [];

	const getPets = (characters: Character | Character[]) => {
		if (!characters) return [];

		// Check for multiple characters
		if (Array.isArray(characters)) {
			return characters
				.filter((character) => character?.[`@_${prefix}:type`] === "Pet")
				.map((pet) => {
					// Get the required properties
					const { name, petType: type, friendshipTowardFarmer } = pet;
					return {
						name: name || "Unknown Pet",
						type: type || "Unknown",
						friendship: friendshipTowardFarmer || 0,
					};
				});
		} else if (characters?.[`@_${prefix}:type`] === "Pet") {
			const { name, petType: type, friendshipTowardFarmer } = characters;
			return [
				{
					name: name || "Unknown Pet",
					type: type || "Unknown",
					friendship: friendshipTowardFarmer || 0,
				},
			];
		}

		return [];
	};

	const farmPets = getPets(farmCharacters);
	const farmHousePets = getPets(farmHouseCharacters);
	const pets = farmPets.concat(farmHousePets);

	return { farmAnimals, pets };
}
