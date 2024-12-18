interface AnimalsRet {
  farmAnimals: FarmAnimal[];
  pets: Pet[];
}

type FarmAnimal = {
  name: string;
  type: string;
  age: number;
  friendshipTowardFarmer: number;
  happiness: number;
};

type Pet = {
  name: string;
  type: string;
  friendship: number;
}

type Building = {
  indoors?: {
    [key: string]: any;
    animals: {
      item: Array<{ value: { FarmAnimal: FarmAnimal } }>;
    };
  };
};

type Character = {
  [key: string]: any;
}

export function parseAnimals(
  buildings: any,
  farmCharacters: any,
  farmHouseCharacters: any,
  prefix: string,
): AnimalsRet {
  const farmAnimals = buildings
    .filter((building: Building) => building.indoors?.[`@_${prefix}:type`] === "AnimalHouse")
    // Get the arrays of animals with the required properties, and flatten them into a single one
    .flatMap((building: Building) => {
      const animals = building.indoors?.animals?.item || [];
      return animals.map((animal) => {
        const { name, type, age, friendshipTowardFarmer: friendship, happiness } = animal.value.FarmAnimal;
        return { name, type, age, friendship, happiness };
      });
    }) || [];

  const getPets = (characters: Character | Character[]) => {
    if (characters) {
      // Check for multiple characters
      if (Array.isArray(characters)) {
        return characters
          .filter((character) => character[`@_${prefix}:type`] === "Pet")
          .map((pet) => {
            // Get the required properties
            const { name, petType: type, friendshipTowardFarmer: friendship } = pet;
            return { name, type, friendship };
          });
      } else if (characters[`@_${prefix}:type`] === "Pet") {
        const { name, petType: type, friendshipTowardFarmer: friendship } = characters;
        return [{ name, type, friendship }];
      }
    }
    
    return [];
  };

  const farmPets = getPets(farmCharacters);
  const farmHousePets = getPets(farmHouseCharacters);
  const pets = farmPets.concat(farmHousePets);

  return { farmAnimals, pets };
}
