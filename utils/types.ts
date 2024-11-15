export enum windrowFillType {
    NULL,
    STRAW,
}

export type Culture = {
    name: string;
    windrow: {
        fillType: string;
        litersPerSqm: number;
        windrowCutFactor: number;
    } | null;
    harvest: {
        litersPerSqm: number;
        beeYieldBonusPercentage: number;
    };
    growth: {
        growthRequireLime: boolean;
    };
    soil: {
        lowDensityRequired: boolean;
        increaseDensity: boolean;
        consumeLime: boolean;
    };
    seeding: {
        needRolling: boolean;
        litersPerSqm: number;
    }
}