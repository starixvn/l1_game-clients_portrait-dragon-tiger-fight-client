import gc from "@sg/game-client-base";
import { _decorator, Component, Node, Vec3 } from "cc";
import { PokerCard, ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { BetChoice, Choice } from "./constants";
import { AnimationUtils } from "db://shared-components/shared/utils";

const { movingNode, getPositionAtDestNode } = AnimationUtils;

const { ccclass, property } = _decorator;

@ccclass("DragonTigerFightCardsContainer")
export default class DragonTigerFightCardsContainer extends Component {
    @property(PokerCard)
    cards: PokerCard[] = [];

    @property(Node)
    nodeCardBox: Node = null;

    private readonly originalCardPosition: Vec3[] = [];

    public initCards() {
        this.cards?.forEach((card) => {
            this.originalCardPosition.push(new Vec3(card.node.position));
            card.faceDown();
        });
    }

    public async drawCards(playSoundDrawCard: Function) {
        const cards = this.cards;
        const pullDuration = 0.1;
        const drawDuration = 0.4;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card.node.active = true;
            card.faceDown();
            const destPosition = getPositionAtDestNode(card.node, this.nodeCardBox);
            card.node.position = destPosition;
            await card.pullCard(pullDuration);
            movingNode(card.node, drawDuration, this.originalCardPosition[i]);
            playSoundDrawCard?.();
            await card.drawCard(drawDuration);
        }
    }

    public async hideCards() {
        const cards = this.cards;
        for (const card of cards) {
            card.node.active = false;
        }
    }

    public renderResultCards(result: gc.GameServiceMessage.TResult) {
        this.cards[Choice.Dragon].setServiceCard(result[BetChoice.Dragon] as ServiceCard);
        this.cards[Choice.Tiger].setServiceCard(result[BetChoice.Tiger] as ServiceCard);
    }

    public async openCards() {
        await this.cards[Choice.Dragon].openCard();
        await this.cards[Choice.Tiger].openCard();
    }

    public openCardsWithoutAnim() {
        this.cards[Choice.Dragon].faceUp();
        this.cards[Choice.Tiger].faceUp();
    }
}
