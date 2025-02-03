import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import { BetHistoryTable } from "db://shared-components/game/bet-history/scripts/components/bet-history-table";
import { Dialog } from "db://shared-components/shared/common-components/dialogs/dialog";
import { SeDieBetHistoryBodyItem } from "./sedie-bet-history-body-item";

const { ccclass, property } = _decorator;

type SeDieBetHistoryTableType = {
    data: gc.BetHistory.BetHistoryModel;
    headerPrefab: Prefab;
    bodyItemPrefab: Prefab;
    resultPrefab: Prefab;
    betsPrefab: Prefab;
};

@ccclass()
export class SeDieBetHistoryTable extends BetHistoryTable {
    @property(Dialog)
    dialog: Dialog = null;

    getHistoryItemComponent(node: Node) {
        return node.getComponent(SeDieBetHistoryBodyItem);
    }

    override buildBodyRow(
        bodyItemPrefab: Prefab,
        betHistoryLog: gc.BetHistory.BetHistoryLog,
        index: number,
        resultPrefab: Prefab,
        betsPrefab?: Prefab
    ): Node {
        const bodyItem = instantiate(bodyItemPrefab);
        this.getHistoryItemComponent(bodyItem)?.setData({
            betHistoryLog,
            index,
            resultPrefab,
            betsPrefab,
        });
        return bodyItem;
    }

    override showBetHistory(model: SeDieBetHistoryTableType) {
        const { data, headerPrefab, bodyItemPrefab, resultPrefab, betsPrefab } = model;
        this.clearOldTable();

        this.header.addChild(instantiate(headerPrefab));
        data.betLogs.forEach((betLogItem, index) => {
            this.body.addChild(this.buildBodyRow(bodyItemPrefab, betLogItem, index, resultPrefab, betsPrefab));
        });
    }

    clearOldTable() {
        this.header.destroyAllChildren();
        this.body.destroyAllChildren();
    }
}
