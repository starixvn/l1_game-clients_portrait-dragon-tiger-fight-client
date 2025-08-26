import { _decorator, Component, Node, Sprite, SpriteAtlas, UITransform, Widget } from "cc";
import { CollapsedScoreboardBeadRoad } from "db://direct-shared-components/scoreboard/scripts/collapsed-scoreboard-bead-road";
import { ScoreboardBeadRoad } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road";

const { ccclass, property } = _decorator;

@ccclass()
export class DragonTigerFightScoreBoard extends Component {
    @property(Node)
    beadRoadWrapper: Node = null;

    @property(Node)
    bigRoadWrapper: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    @property(Sprite)
    sprChangeModeBeadRoad: Sprite = null;

    @property(ScoreboardBeadRoad)
    expandedBeadRoad: ScoreboardBeadRoad = null;

    @property(CollapsedScoreboardBeadRoad)
    collapsedBeadRoad: CollapsedScoreboardBeadRoad = null;

    private isExpandBeadRoad = false;

    private readonly WIDTH_EXPAND_BEADROAD = 544;
    private readonly WIDTH_COLLAPSE_BEADROAD = 98;
    private readonly WIDTH_SPACING = 15;
    private readonly WIDTH_GAME = 828;
    private readonly WIDTH_BIG_ROAD_LEFT = 9;

    onClickExpandMode() {
        this.isExpandBeadRoad = !this.isExpandBeadRoad;
        if (this.isExpandBeadRoad) {
            this.beadRoadWrapper.getComponent(UITransform).width = this.WIDTH_EXPAND_BEADROAD;
            this.bigRoadWrapper.getComponent(UITransform).width = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD - 11;
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-collapse");
            this.expandedBeadRoad.node.active = true;
            this.collapsedBeadRoad.node.active = false;
        } else {
            this.beadRoadWrapper.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.bigRoadWrapper.getComponent(UITransform).width =
                this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD - this.WIDTH_BIG_ROAD_LEFT;
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-expand");
            this.expandedBeadRoad.node.active = false;
            this.collapsedBeadRoad.node.active = true;
        }
        this.bigRoadWrapper.getComponent(Widget).left = this.WIDTH_BIG_ROAD_LEFT;
    }
    onClickBigRoadWrapper() {
        if (!this.isExpandBeadRoad) {
            return;
        }
        this.onClickExpandMode();
    }
}
