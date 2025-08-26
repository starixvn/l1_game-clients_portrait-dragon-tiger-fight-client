import "./../../../resources/i18n";
import gc from "@sg/game-client-base";
import { _decorator, Node, sp, tween, Vec3 } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { WinningResult } from "db://shared-components/shared/common-components/winning-result/scripts/winning-result";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { settings } from "../game-settings";
import { containerOptions } from "../containerOptions";
import { BetChoice } from "./constants";
import { AnimationUtils } from "db://shared-components/shared/utils";
import DragonTigerFightCardsContainer from "./dragon-tiger-fight-cards-container";

const { playSpine, fadeOut, fadeIn } = AnimationUtils;

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, RoundHistories, Translator } = gc;

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    override namespace = settings.name;
    override containerOptions = containerOptions;

    @property(ChipFlying)
    chipFlying: ChipFlying = null;

    @property(Node)
    nodeAudioContainer: Node = null;

    @property({ type: sp.Skeleton })
    resultSpines: sp.Skeleton[] = [];

    @property({ type: Node })
    staticMonsters: Node[] = [];

    @property(WinningResult)
    winningResult: WinningResult = null;

    @property(DragonTigerFightCardsContainer)
    cardsContainer: DragonTigerFightCardsContainer = null;

    private audioContainer: AudioContainer = null;
    private readonly choiceWinningSounds = {
        dragon: "dragon-growl",
        tiger: "tiger-growl",
    };
    protected enableFixHandleFinish = true;

    onLoad() {
        super.onLoad();
        this.audioContainer = this.nodeAudioContainer?.getComponent(AudioContainer);
        this.cardsContainer?.initCards();
        this.initResultSpines();
        this.winningResult?.hideQuickly();
    }

    private initResultSpines() {
        this.resultSpines?.forEach((spine) => {
            spine.node.active = false;
        });
    }

    async finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        await this.showResultSpines(settlementResult);
        this.playWinningChoiceSound(settlementResult);
        await this.winningResult.show();
        const resultSpineDuration = 1.67;
        const showWinningResultDuration = 1 + (settlementResult[BetChoice.Tie] ? resultSpineDuration : 0);
        await AnimationUtils.delayTime(showWinningResultDuration);
        this.winningResult.hide();
        super.finishShowResult(result, settlementResult);
        this.chipFlying.callActionPayChips();
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.cardsContainer?.renderResultCards(result);

            if (hasAnimation) {
                await this.cardsContainer?.openCards();
            } else {
                this.cardsContainer?.openCardsWithoutAnim();
            }
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const lastRound = firstJoinGameHistory.roundHistory as any;
        if (lastRound) {
            const animated = firstJoinGameHistory.animationHighlight;
            animated && this.showResult(lastRound?.result, false);
        }
    }

    private async showResultSpines(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const winChoice = Object.keys(settlementResult).find((choice) => settlementResult[choice]);
        if (winChoice === BetChoice.Tie) {
            return;
        }
        const spine = this.resultSpines.find((spine) => spine.node.name === winChoice);
        const staticImage = this.staticMonsters.find((staticMonster) => staticMonster.name === winChoice);
        if (spine) {
            staticImage && fadeOut(staticImage, 0.2);
            spine.node.active = true;
            this.playSound(this.choiceWinningSounds[winChoice]);
            const animationName = winChoice;
            const duration = spine.findAnimation(animationName).duration;
            const hidingDuration = 0.2;
            const scaleNode = spine.node.parent;
            const originalScale = new Vec3(scaleNode.scale);
            tween(scaleNode)
                .delay(duration - hidingDuration)
                .call(() => {
                    staticImage && fadeIn(staticImage, hidingDuration);
                })
                .to(hidingDuration, { scale: Vec3.ONE })
                .start();
            await playSpine(spine, animationName);
            spine.node.active = false;
            scaleNode.scale = originalScale;
        }
    }

    private playWinningChoiceSound(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const winChoice = this.winningResult.setSettlementResult(settlementResult);
        !!winChoice && this.playSound(this.getAudioKeyChoiceWinning(winChoice));
    }

    private getAudioKeyChoiceWinning(name: string): string {
        return `${name.toLowerCase()}_${Translator.getLanguageId() || "en"}`;
    }
}
