class BitTracker {
    public tracker: BigInt[] = [];

    private ensureSize(index: number) {
        const arrayIndex = Math.floor(index / 64);
        while (this.tracker.length <= arrayIndex) {
            this.tracker.push(0n);
        }
    }

    public set(index: number) {
        this.ensureSize(index);
        const arrayIndex = Math.floor(index / 64);
        const bitIndex = index % 64;
        // @ts-ignore
        this.tracker[arrayIndex] = BigInt(this.tracker[arrayIndex]) | (BigInt(1) << BigInt(bitIndex));
    }

    public test(index: number): boolean {
        this.ensureSize(index);
        const arrayIndex = Math.floor(index / 64);
        const bitIndex = index % 64;

        // @ts-ignore
        return (BigInt(this.tracker[arrayIndex]) & (BigInt(1) << BigInt(bitIndex))) !== 0n;
    }

    public bits(): BigInt[] {
        return this.tracker;
    }
}

let bitTracker = new BitTracker();

let ids = {
        '128': true,
        '129': true,
        '130': true,
        '131': true,
        '132': true,
        '136': true,
        '137': true,
        '138': true,
        '139': true,
        '140': true,
        '141': true,
        '142': true,
        '143': true,
        '144': true,
        '145': true,
        '146': true,
        '147': true,
        '148': true,
        '149': true,
        '150': false,
        '151': true,
        '152': true,
        '153': false,
        '154': true,
        '155': true,
        '156': true,
        '157': true,
        '158': true,
        '159': true,
        '160': true,
        '161': true,
        '162': true,
        '163': true,
        '164': true,
        '165': true,
        '267': true,
        '269': true,
        '682': true,
        '698': true,
        '699': true,
        '700': true,
        '701': true,
        '702': true,
        '704': true,
        '705': true,
        '706': true,
        '707': true,
        '708': true,
        '715': true,
        '716': true,
        '717': false,
        '718': true,
        '719': true,
        '720': true,
        '721': true,
        '722': true,
        '723': true,
        '734': true,
        '775': true,
        '795': true,
        '796': true,
        '798': true,
        '799': true,
        '800': true,
        '836': true,
        '837': true,
        '838': true
      }

for (let id in ids) {
    bitTracker.set(parseInt(id));
}

console.log('test 999', bitTracker.test(999)); // true
console.log('test 998', bitTracker.test(998)); // false
console.log(bitTracker.bits())
