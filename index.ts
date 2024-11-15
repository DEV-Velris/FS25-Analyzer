import {InitializeGameFolder} from "./functions/gameFolder";
import {ConvertFoliageXmlToObject} from "./functions/converter";

async function Main(): Promise<void> {
    await InitializeGameFolder();
    const cultures = await ConvertFoliageXmlToObject();
    console.log(cultures[10]);
}

Main();