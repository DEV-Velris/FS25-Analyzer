import {Culture, Seed} from "../utils/types";
import {ConvertFoliageXmlToObject, ConvertSeedXmlToObject, GetAllBestPrices} from "./converter";

type AnalyzeResult = {
    seed: {
        seedLitersPerHectare: number;
        seedPricePerHectare: number;
    };
    harvest: {
        harvestLitersPerHectare: number;
        harvestPricePerHectare: number;
    };
}

/**
 * Return the result of the analysis in ascendant order
 */
async function Analyze(): Promise<Record<string, AnalyzeResult>> {
    return new Promise<Record<string, AnalyzeResult>>(async (resolve): Promise<void> => {
        const cultures: Culture[] = await ConvertFoliageXmlToObject();
        const seed: Seed = await ConvertSeedXmlToObject();
        const highestPrices: Record<string, number> = await GetAllBestPrices();
        const results: Record<string, AnalyzeResult> = {};

        for (const culture of cultures) {
            results[culture.name] = {
                seed: {
                    seedLitersPerHectare: culture.seeding.litersPerSqm * 10000,
                    seedPricePerHectare: ((culture.seeding.litersPerSqm * 10000) / seed.amount) * seed.price,
                },
                harvest: {
                    harvestLitersPerHectare: culture.harvest.litersPerSqm * 10000,
                    harvestPricePerHectare: ((culture.harvest.litersPerSqm * 10000) / 1000) * highestPrices[culture.name],
                }
            }
        }

        resolve(results);
    });
}

export async function ShowBestCultures(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
        const results: Record<string, AnalyzeResult> = await Analyze();

        console.table(results, ["seed.seedPricePerHectare", "harvest.harvestPricePerHectare"]);

        resolve();
    });
}