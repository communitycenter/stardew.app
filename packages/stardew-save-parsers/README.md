# Stardew Valley Parsers

A TypeScript library for parsing Stardew Valley save files and extracting structured data about player progress, achievements, and game state.

## Installation

```bash
npm install @communitycenter/stardew-save-parser
```

## Usage

```typescript
import { parseSaveFile } from "stardew-parsers";

// Parse a Stardew Valley save file
const xmlContent = fs.readFileSync("save_file.xml", "utf8");
const players = parseSaveFile(xmlContent);

// Access parsed data
const player = players[0];
console.log(player.general.name); // Player name
console.log(player.fishing.totalCaught); // Total fish caught
console.log(player.bundles); // Community Center bundles
```

## API Reference

### Main Function

#### `parseSaveFile(xml: string): PlayerData[]`

Parses a Stardew Valley save file XML and returns an array of player data objects.

**Parameters:**

- `xml` (string): The XML content of the Stardew Valley save file

**Returns:** Array of `PlayerData` objects, one for each player in the save file

### Response Types

The library exports comprehensive TypeScript types for all parsed data. Here are the main response types:

#### General Player Data

```typescript
interface GeneralRet {
  name?: string;
  timePlayed?: string;
  farmInfo?: string;
  totalMoneyEarned?: number;
  skills?: SkillsRet;
  questsCompleted?: number;
  stardrops?: StardropsRet;
  experience?: ExperienceRet;
  gameVersion?: string;
  jojaMembership?: JojaRet;
  achievements?: AchievementsRet;
}
```

#### Fishing Data

```typescript
interface FishRet {
  totalCaught?: number;
  fishCaught: string[];
}
```

#### Shipping Data

```typescript
interface ShippingRet {
  shipped: { [key: string]: number | null };
}
```

#### Museum Data

```typescript
interface MuseumRet {
  artifacts?: string[];
  minerals?: string[];
}
```

#### Cooking Data

```typescript
interface CookingRet {
  recipes: { [key: string]: 0 | 1 | 2 }; // 0=unknown, 1=known, 2=cooked
}
```

#### Crafting Data

```typescript
interface CraftingRet {
  recipes: { [key: string]: 0 | 1 | 2 }; // 0=unknown, 1=known, 2=crafted
}
```

#### Social Data

```typescript
interface SocialRet {
  childrenCount?: number;
  houseUpgradeLevel?: number;
  spouse?: string | null;
  relationships: { [key: string]: Relationship };
}

interface Relationship {
  points: number;
  status?: string;
}
```

#### Monsters Data

```typescript
interface MonstersRet {
  deepestMineLevel?: number;
  deepestSkullCavernLevel?: number;
  monstersKilled: Record<string, number>;
}
```

#### Perfection Data

```typescript
interface PerfectionRet {
  numObelisks?: number;
  goldenClock?: boolean;
  perfectionWaivers?: number;
}
```

#### Powers Data (1.6+)

```typescript
interface PowersRet {
  collection?: string[];
  MasteryExp?: number;
}
```

#### Notes & Scraps Data

```typescript
interface NotesRet {
  found: number[];
}

interface ScrapsRet {
  found: number[];
}
```

#### Walnuts Data

```typescript
interface WalnutRet {
  found: { [key: string]: number };
  activatedGoldenParrot?: boolean;
}
```

#### Animals Data

```typescript
interface AnimalsRet {
  farmAnimals: FarmAnimal[];
  pets: Pet[];
}

interface FarmAnimal {
  name: string;
  type: string;
  age: number;
  friendshipTowardFarmer: number;
  happiness: number;
}

interface Pet {
  name: string;
  type: string;
  friendship: number;
}
```

#### Bundle Data

```typescript
interface BundleWithStatus {
  bundle: Bundle;
  bundleStatus: boolean[];
}

interface Bundle {
  name: string;
  areaName?: CommunityCenterRoomName;
  localizedName?: string;
  color?: number;
  items: (BundleItem | Randomizer)[];
  itemsRequired: number;
  bundleReward: BundleReward;
}
```

## Game Version Support

This library supports Stardew Valley versions 1.5 and 1.6. The parser automatically detects the game version and handles the differences between versions appropriately.

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run tests
bun test
```

## License

MIT
