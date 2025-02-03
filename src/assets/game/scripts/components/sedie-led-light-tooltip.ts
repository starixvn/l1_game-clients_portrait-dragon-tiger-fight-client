import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";

import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";

const { ccclass, property } = _decorator;

const BetChoice = {
    EVEN: "even",
    ODD: "odd",
};

@ccclass()
export class SeDieLedLightToolTip extends LedLightTooltip {
    @property(Label)
    lblOdd: Label = null;

    @property(Label)
    lblEven: Label = null;

    private readonly dotsTotal = 4;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        const { roundId, settlementResult, result } = ledLightInfo;

        this.roundId.string = `#${roundId}`;
        const choiceWin = settlementResult[BetChoice.EVEN] ? BetChoice.EVEN : BetChoice.ODD;
        this.result.string = gc.Translator.gameTranslate(`glossary_${choiceWin}`).toUpperCase();

        let countRed = 0;
        Object.values(result).forEach((value) => {
            if (value) {
                countRed++;
            }
        });
        this.lblOdd.string = `${countRed}`;
        this.lblEven.string = `${this.dotsTotal - countRed}`;
    }
}
