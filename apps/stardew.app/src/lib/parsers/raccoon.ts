import objectsRaw from "@/data/objects.json";
import requestsRaw from "@/data/raccoon.json";
import { CSRandom } from "@/lib/cs-random.js";
import { getRandomSeed } from "../utils";

interface Requests {
	first: Request[];
	second: Request[];
	third: Request[];
	fourth: Request[];
	fifth: Request[];
	randomRewards: Request[];
}

interface ParsedRequests {
	currentRequest: number;
	requests: Request[][];
}

// Context object used during parsing of each request
interface RequestContext {
	requestItems: Request[]; // The array of items/rewards for the current request
	rng: InstanceType<typeof CSRandom>[]; // Array of RNG instances, one per season
	prevRoll: number[]; // Array storing the last picked index per season, used to avoid duplicates
}

type Request =
	| { item: string[] | string[][]; quantity: number }
	| { reward: string[]; quantity: number; fallback?: Request };

const RNG_BURN_COUNT = 10; // Number of RNG iterations to "burn" for sync
const FIXED_REQUESTS = 5; // First requests are fixed, after that they randomly mimic the first ones
const SEED_MULTIPLIER = 377;
const SEASONS = 4;
const REQUESTS_FOR_ACHIEVEMENT = 9;

function isRequestItem(
	r: Request,
): r is { item: string[] | string[][]; quantity: number } {
	return "item" in r;
}

function isRequestReward(
	r: Request,
): r is { reward: string[]; quantity: number; fallback?: Request } {
	return "reward" in r;
}

const objects: Record<
	string,
	Record<string, string | null>
> = objectsRaw as Record<string, Record<string, string | null>>;

const requests = requestsRaw as Requests;

const getObjectName = (key: string | string[]) =>
	Array.isArray(key)
		? (objects[key[0]]?.name ?? key[0])
		: (objects[key]?.name ?? key);

// This selects an item for each season, optionally avoiding duplicates from prevRoll
const generateSeasonArray = (
	rng: InstanceType<typeof CSRandom>[],
	items: string[] | string[][],
	prefix: string,
	prevRoll?: number[],
	avoidPrev = false,
): string[] => {
	const seasons: string[][] = Array.isArray(items[0])
		? (items as string[][])
		: [items as string[]];

	return seasons.map((seasonItems, s) => {
		let idx = rng[s].Next(seasonItems.length);

		if (avoidPrev && prevRoll) {
			while (idx === prevRoll[s]) {
				idx = rng[s].Next(seasonItems.length);
			}
		}

		if (prevRoll) {
			prevRoll[s] = idx;
		}

		return `${prefix}${getObjectName(seasonItems[idx])}`;
	});
};

// A safe helper to add request items to the context
const pushItem = (
	ctx: RequestContext,
	currentRequestData: Request | undefined,
	prefix = "",
	avoidPrev = false,
	mapFn?: (s: string) => string, // Function to transform item names
) => {
	if (!currentRequestData || !isRequestItem(currentRequestData)) return;

	const items = generateSeasonArray(
		ctx.rng,
		currentRequestData.item,
		prefix,
		ctx.prevRoll,
		avoidPrev,
	);

	ctx.requestItems.push({
		item: mapFn ? items.map(mapFn) : items,
		quantity: currentRequestData.quantity,
	});
};

const pushReward = (ctx: RequestContext, reward: Request) => {
	if (isRequestItem(reward)) {
		ctx.requestItems.push({
			item: reward.item.map(getObjectName),
			quantity: reward.quantity,
		});
	} else if (isRequestReward(reward)) {
		ctx.requestItems.push({
			reward: reward.reward.map(getObjectName),
			quantity: reward.quantity,
			// Some rewards have fallback
			...(reward.fallback && isRequestItem(reward.fallback)
				? {
						fallback: {
							item: reward.fallback.item.map(getObjectName),
							quantity: reward.fallback.quantity,
						},
					}
				: {}),
		});
	}
};

// Configuration for each request type
interface RequestPushConfig {
	index: number; // Index in the request data array to pick
	prefix?: string;
	avoidPrev?: boolean;
	mapFn?: (s: string) => string;
	burnAfter?: boolean; // Burn extra RNG after push for sync
}

const requestConfigs: Record<number, RequestPushConfig[]> = {
	0: [
		{ index: 0, burnAfter: true },
		{ index: 1, prefix: "Smoked " },
	],
	1: [
		{ index: 0, prefix: "Dried " },
		{ index: 0, avoidPrev: true, mapFn: (i) => i + " Jelly" },
	],
	2: [{ index: 0, prefix: "Dried " }, { index: 1 }],
	3: [
		{ index: 0, mapFn: (i) => i + " Juice" },
		{ index: 0, prefix: "Pickled ", avoidPrev: true },
	],
	4: [], // Special case, handled separately
};

const handleRequest = (
	ctx: RequestContext,
	currentRequestData: Request[],
	requestNum: number,
) => {
	if (requestNum === 4) {
		const itemsOnly = currentRequestData.filter(isRequestItem);

		if (!itemsOnly.length) {
			return;
		}

		let idx = ctx.rng[0].Next(itemsOnly.length);

		ctx.requestItems.push({
			item: [getObjectName(itemsOnly[idx].item[0])],
			quantity: itemsOnly[idx].quantity,
		});

		let prevIdx = idx;

		do {
			idx = ctx.rng[0].Next(itemsOnly.length);
		} while (idx === prevIdx);

		ctx.requestItems.push({
			item: [getObjectName(itemsOnly[idx].item[0])],
			quantity: itemsOnly[idx].quantity,
		});

		return;
	}

	const config = requestConfigs[requestNum];

	for (const cfg of config) {
		pushItem(
			ctx,
			currentRequestData[cfg.index],
			cfg.prefix,
			cfg.avoidPrev,
			cfg.mapFn,
		);

		if (cfg.burnAfter) {
			// Burn extra RNGs for seasons 1-3 to keep sync
			for (let s = 1; s < SEASONS; s++) {
				ctx.rng[s].Next();
			}
		}
	}
};

const handleReward = (
	ctx: RequestContext,
	currentRequestData: Request[],
	timesFed: number,
	legacyRandom: number,
	saveID: number,
) => {
	if (timesFed < FIXED_REQUESTS) {
		// Fixed rewards: take reward from request data
		const rewardDef = currentRequestData.find(isRequestReward);
		if (rewardDef) pushReward(ctx, rewardDef);
	} else {
		// Random rewards: generate RNG and pick one
		const RewardCtor: any = CSRandom as any;
		const rewardRng = new RewardCtor(
			getRandomSeed(legacyRandom, saveID, (timesFed + 1) * SEED_MULTIPLIER),
		);
		for (let i = 0; i < RNG_BURN_COUNT; i++) {
			rewardRng.Next(); // Like above, burn to sync
		}

		const randomReward =
			requests.randomRewards[rewardRng.Next(requests.randomRewards.length)];
		pushReward(ctx, randomReward);
	}
};

export function parseRaccoon(
	legacyRandom: number,
	saveID: number,
	timesFedInSave: number,
): ParsedRequests {
	const raccoonRequests: Request[][] = [];
	let timesFed = 0;

	// Extract request keys from JSON (ignore randomRewards)
	const requestKeys = (Object.keys(requests) as (keyof Requests)[]).filter(
		(k) => k !== "randomRewards",
	);

	for (
		let requestNum = 0;
		requestNum < REQUESTS_FOR_ACHIEVEMENT;
		requestNum++
	) {
		const ctx: RequestContext = { requestItems: [], rng: [], prevRoll: [] };

		// Initialize RNGs, one per season
		for (let s = 0; s < SEASONS; s++) {
			const CSRandomCtor: any = CSRandom as any;
			ctx.rng[s] = new CSRandomCtor(
				getRandomSeed(legacyRandom, saveID, timesFed * SEED_MULTIPLIER),
			);

			for (let i = 0; i < RNG_BURN_COUNT; i++) ctx.rng[s].Next();
		}

		const whichRequest =
			timesFed < FIXED_REQUESTS
				? timesFed % FIXED_REQUESTS
				: ctx.rng[0].Next(FIXED_REQUESTS);

		if (timesFed >= FIXED_REQUESTS)
			// Burn RNG for seasons 1-3 to maintain sync for random requests
			for (let s = 1; s < SEASONS; s++) ctx.rng[s].Next();

		const currentRequestData = requests[requestKeys[whichRequest]];
		handleRequest(ctx, currentRequestData, whichRequest);
		handleReward(ctx, currentRequestData, timesFed, legacyRandom, saveID);
		raccoonRequests.push(ctx.requestItems);
		timesFed++;
	}

	return {
		currentRequest: timesFedInSave + 1,
		requests: raccoonRequests,
	};
}
