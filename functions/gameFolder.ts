import {createInterface, Interface} from "node:readline";

export const foliageToAnalyze: string[] = [
    "barley",
    "beetRoot",
    "canola",
    "carrot",
    "cotton",
    "greenBean",
    "maize",
    "oat",
    "oilseedRadish",
    "parsnip",
    "pea",
    "poplar",
    "potato",
    "rice",
    "riceLongGrain",
    "sorghum",
    "soybean",
    "spinach",
    "sugarbeet",
    "sugarcane",
    "sunflower",
    "wheat"
]

export let foliageFolder: string = "/data/foliage/";
export let seedXML: string = "/data/objects/bigBag/seeds/bigBag_seeds.xml";
export let sellPriceXML: string = "/data/maps/maps_fillTypes.xml";


async function AskForGameFolder(): Promise<string>  {
    const readLine: Interface = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve): void => {
        readLine.question("Please enter the folder of the game: ", (gameFolder: string): void => {
            readLine.close();
            resolve(gameFolder);
        });
    });
}

export async function InitializeGameFolder(): Promise<void> {
    return new Promise<void>(async (resolve): Promise<void> => {
        const gameFolder: string = await AskForGameFolder();

        foliageFolder = gameFolder + foliageFolder;
        seedXML = gameFolder + seedXML;
        sellPriceXML = gameFolder + sellPriceXML;

        resolve();
    });
}