declare class CSRandom {
	constructor(seed: number);

	Sample(): number;
	InternalSample(): number;
	GetSampleForLargeRange(): number;
	Next(): number;
	Next(max: number): number;
	Next(min: number, max: number): number;
}

export { CSRandom };
