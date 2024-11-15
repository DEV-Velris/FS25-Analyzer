import {Culture, Seed} from "../utils/types";
import {foliageFolder, foliageToAnalyze, seedXML, sellPriceXML} from "./gameFolder";
import {XMLParser} from "fast-xml-parser";
import * as fs from "node:fs";

export async function ConvertFoliageXmlToObject(): Promise<Culture[]> {
    return new Promise<Culture[]>((resolve): void => {
        const xmlParser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

        let cultures: Culture[] = [];

        for (const foliage of foliageToAnalyze) {
            const xml: string = fs.readFileSync(`${foliageFolder}${foliage}/${foliage}.xml`, "utf8");
            const json: any = xmlParser.parse(xml);

            cultures.push({
                name: json.foliageType.fruitType.name,
                windrow: json.foliageType.fruitType.windrow?.fillType ? {
                    fillType: json.foliageType.fruitType.windrow.fillType,
                    litersPerSqm: parseFloat(json.foliageType.fruitType.windrow.litersPerSqm),
                    windrowCutFactor: parseFloat(json.foliageType.fruitType.windrow.windrowCutFactor),
                } : null,
                harvest: {
                    litersPerSqm: parseFloat(json.foliageType.fruitType.harvest.litersPerSqm),
                    beeYieldBonusPercentage: parseFloat(json.foliageType.fruitType.harvest.beeYieldBonusPercentage),
                },
                growth: {
                    growthRequireLime: json.foliageType.fruitType.growth.growthRequireLime === "true",
                },
                soil: {
                    lowDensityRequired: json.foliageType.fruitType.soil.lowDensityRequired === "true",
                    increaseDensity: json.foliageType.fruitType.soil.increaseDensity === "true",
                    consumeLime: json.foliageType.fruitType.soil.consumeLime === "true",
                },
                seeding: {
                    needRolling: json.foliageType.fruitType.seeding.needRolling === "true",
                    litersPerSqm: parseFloat(json.foliageType.fruitType.seeding.litersPerSqm),
                }
            });
        }

        resolve(cultures);
    });
}

export async function ConvertSeedXmlToObject(): Promise<Seed> {
    return new Promise<Seed>((resolve): void => {
        const xmlParser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

        const xml: string = fs.readFileSync(seedXML, "utf8");
        const json: any = xmlParser.parse(xml);

        return resolve({
            price: json.vehicle.parentFile.attributes.set.filter((set: { path: string; }) => set.path === 'vehicle.storeData.price')[0].value,
            amount: json.vehicle.parentFile.attributes.set.filter((set: { path: string; }) => set.path === 'vehicle.fillUnit.fillUnitConfigurations.fillUnitConfiguration(0).fillUnits.fillUnit#startFillLevel')[0].value
        })
    });
}

function getHighestPrince(fillType: any): number {
    const initialPrice = parseFloat(fillType.economy.pricePerLiter);
    let bestPrice = 0;
    if (fillType.economy.factors) {
        for (const value of fillType.economy.factors.factor) {
            if (initialPrice * parseFloat(value.value) > bestPrice) {
                bestPrice = initialPrice * parseFloat(value.value);
            }
        }
    } else {
        bestPrice = initialPrice;
    }

    return bestPrice;
}

export async function GetAllBestPrices(): Promise<Record<string, number>> {
    return new Promise<Record<string, number>>((resolve): void => {
        const xmlParser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

        const xml: string = fs.readFileSync(sellPriceXML, "utf8");
        const json: any = xmlParser.parse(xml);

        const prices: Record<string, number> = {};

        for (const fillType of json.map.fillTypes.fillType) {
            // prices[fillType.name] = parseFloat(fillType.pricePerLiter);
            if (foliageToAnalyze.includes(fillType.name.toLowerCase())) {
                prices[fillType.name.toLowerCase()] = getHighestPrince(fillType);
            }
        }

        resolve(prices);
    });
}