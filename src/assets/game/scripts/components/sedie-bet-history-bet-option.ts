import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label } from "cc";

const { property, ccclass } = _decorator;

@ccclass
export default class SeDieBetHistoryBetOption extends Component {
    @property(Label)
    choice: Label = null;

    @property(Label)
    stake: Label = null;

    protected convertChoiceData(choice: string): string {
        let betChoice = "";
        const choiceData = ["even", "odd", "red2", "red3", "red4", "white3", "white4"];
        const choiceStr = [
            "glossary_even",
            "glossary_odd",
            "bet_option_red2",
            "bet_option_red3",
            "bet_option_red4",
            "bet_option_white3",
            "bet_option_white4",
        ];
        choiceData.forEach((item, index) => {
            if (choice === item) {
                betChoice = choiceStr[index];
            }
        });
        return betChoice;
    }

    handleBetOptionItem(choice: string, odd: string, stake: string) {
        const choiceStr = this.convertChoiceData(choice);
        this.choice.string = `${gc.Translator.gameTranslate(choiceStr)} @ ${odd}`;
        this.stake.string = stake;
    }

    highlightForWinning(win: boolean) {
        const color = win ? Color.YELLOW : Color.WHITE;
        this.choice.color = color;
        this.stake.color = color;
    }
}
