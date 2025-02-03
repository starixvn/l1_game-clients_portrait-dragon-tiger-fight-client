import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Sprite, SpriteFrame } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";

const { ccclass, property } = _decorator;

@ccclass()
export class SeDieHistoryResultBodyItem extends BaseResultBodyItem {
    @property(Sprite)
    dot: Sprite = null;

    @property(Label)
    result: Label = null;

    @property(SpriteFrame)
    sprOdd: SpriteFrame = null;

    @property(SpriteFrame)
    sprEven: SpriteFrame = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        let number = 0;
        Object.keys(result).forEach((key) => {
            if (result[key]) {
                number++;
            }
        });

        this.result.string = number.toString();
        if (number % 2) {
            this.dot.spriteFrame = this.sprOdd;
            this.result.color = Color.WHITE;
        } else {
            this.dot.spriteFrame = this.sprEven;
            this.result.color = Color.BLACK;
        }
    }
}
