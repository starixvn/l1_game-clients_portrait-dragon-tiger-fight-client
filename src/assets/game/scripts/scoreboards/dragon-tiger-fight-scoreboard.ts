import { _decorator, Component, Layout, Node, Sprite, SpriteAtlas, Tween, UITransform, Widget } from "cc";

const { ccclass, property } = _decorator;

@ccclass()
export class DragonTigerFightScoreBoard extends Component {
    @property(Node)
    beadRoadWrapper: Node = null;

    @property(Node)
    bigRoadWrapper: Node = null;

    @property(Layout)
    layoutContainer: Layout = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    @property(Sprite)
    sprChangeModeBeadRoad: Sprite = null;

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
        } else {
            this.beadRoadWrapper.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.bigRoadWrapper.getComponent(UITransform).width =
                this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD - this.WIDTH_BIG_ROAD_LEFT;
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-expand");
        }
        this.bigRoadWrapper.getComponent(Widget).left = this.WIDTH_BIG_ROAD_LEFT;
    }
}
