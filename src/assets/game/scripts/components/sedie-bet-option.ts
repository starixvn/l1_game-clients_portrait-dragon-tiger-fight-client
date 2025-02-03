import { _decorator, Component, Label } from "cc";
import * as i18n from "db://i18n/LanguageData";

const { property, ccclass } = _decorator;

@ccclass
export default class SedieBetOption extends Component {
    @property(Label)
    lblChoice: Label = null;

    protected onLoad(): void {
        const isBigSizeLanguage = i18n._language === "id";
        if (isBigSizeLanguage) {
            this.lblChoice.fontSize = 38;
        }
    }
}
