import {
  initDiv,
  initSpan,
  initH3,
} from "../../js-utilities/commonDomComponents";
import GameboardDom from "./GameboardDom.js";
import { pubSubTokensUi } from "../pubSubTokens.js";
import PubSub from "pubsub-js";

const blockName = "player";
const cssClass = {
  playerH3: "player-h3",
  nameSpan: "name-span",
  dividerSpan: "divider-span",
  deployedFleetSizeSpan: "deployed-fleet-size-span",
  textShipsSpan: "text-ship-span",
  gameboardCnt: "gameboard",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class PlayerDom {
  #div;
  #player;
  #gameboardDiv;

  constructor(player) {
    this.#player = player;
    this.#div = this.#initPlayerDiv(player);
    this.#div.obj = this;

    PubSub.subscribe(
      pubSubTokensUi.setCurrentPlayer(player),
      this.#markCurrentPlayer.bind(this)
    );

    PubSub.subscribe(
      pubSubTokensUi.enableAimingOnGameboard(player),
      this.#enableAimingOnGameboard.bind(this)
    );

    PubSub.subscribe(
      pubSubTokensUi.showAttackOutcome(player),
      this.#showAttackOutcome.bind(this)
    );

    PubSub.subscribe(pubSubTokensUi.toggleDeployedFleetShown(player), () => {
      this.#gameboardDiv.obj.toggleDeployedFleet();
    });

    PubSub.subscribe(pubSubTokensUi.hideDeployedFleetShown(player), () => {
      this.#gameboardDiv.obj.hideDeployedFleet();
    });

    PubSub.subscribe(pubSubTokensUi.updateDeployedFleetShown(player), () => {
      this.#gameboardDiv.obj.updateDeployedFleet();
    });
  }

  // getters
  get div() {
    return this.#div;
  }
  get player() {
    return this.#player;
  }

  #markCurrentPlayer(msg, currentPlayer) {
    this.#div.classList.toggle("currentPlayer", currentPlayer);
  }

  #enableAimingOnGameboard() {
    this.#gameboardDiv.obj.enableAiming();
  }

  #showAttackOutcome(msg, { coords, outcome }) {
    if (outcome.isSunk) {
      PubSub.publish(pubSubTokensUi.shipHasSunk(this.#player));
    }
    this.#gameboardDiv.obj.showAttackOutcome(coords, outcome);
  }

  #initPlayerDiv(player) {
    const div = initDiv(blockName);
    const h3 = this.#initHeaderDiv(player);

    const gameboardCnt = initDiv(getCssClass("gameboardCnt"));
    const gameboardDom = new GameboardDom(player.gameboard);
    this.#gameboardDiv = gameboardDom.div;
    gameboardCnt.append(this.#gameboardDiv);

    div.append(h3, gameboardCnt);

    return div;
  }

  #initHeaderDiv(player) {
    const h3 = initH3(getCssClass("playerH3"));
    const nameSpan = initSpan(getCssClass("nameSpan"));
    const dividerSpan = initSpan(getCssClass("dividerSpan"));
    const deployedFleetSizeSpan = initSpan(
      getCssClass("deployedFleetSizeSpan")
    );
    const textShipsSpan = initSpan(getCssClass("textShipsSpan"));

    nameSpan.textContent = player.name;
    dividerSpan.textContent = " - ";
    deployedFleetSizeSpan.textContent = player.gameboard.deployedFleet.length;
    textShipsSpan.textContent = " ships";

    PubSub.subscribe(pubSubTokensUi.shipHasSunk(player), () => {
      const fleetLength = player.gameboard.deployedFleet.length;
      deployedFleetSizeSpan.textContent = fleetLength;
      textShipsSpan.textContent = fleetLength == 1 ? " ship " : " ships";
    });

    h3.append(nameSpan, dividerSpan, deployedFleetSizeSpan, textShipsSpan);
    return h3;
  }
}
