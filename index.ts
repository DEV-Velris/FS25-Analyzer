import {InitializeGameFolder} from "./functions/gameFolder";
import {ShowBestCultures} from "./functions/analyzer";

async function Main(): Promise<void> {
    await InitializeGameFolder().then(() => ShowBestCultures());
}

Main();