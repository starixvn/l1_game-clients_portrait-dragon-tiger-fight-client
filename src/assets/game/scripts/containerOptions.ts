import gc from "@sg/game-client-base";
import { sharedContainer } from "../../scripts/shared-container";
import { settings } from "./game-settings";
import { LogStore } from "../../../extensions/shared-components/assets/game/scripts/stores/log-store";


export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
