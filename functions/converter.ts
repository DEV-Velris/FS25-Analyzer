import {Culture} from "../utils/types";
import {foliageFolder, foliageToAnalyze} from "./gameFolder";
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
            const xml = fs.readFileSync(`${foliageFolder}${foliage}/${foliage}.xml`, "utf8");
            const json = xmlParser.parse(xml);

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