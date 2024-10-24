import { initDiv, initH3 } from "../../js-utilities/commonDomComponents";
import GameboardDom from "./GameboardDom.js";
import { pubSubTokensUi } from "../pubSubTokens.js";

const blockName = "player";
const cssClass = {
  nameH3: "name-h3",
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
      pubSubTokensUi.enableAimingOnGameboard(player),
      this.#enableAimingOnGameboard.bind(this)
    );

    PubSub.subscribe(
      pubSubTokensUi.showAttackOutcome(player),
      this.#showAttackOutcome.bind(this)
    );
  }

  // getters
  get div() {
    return this.#div;
  }
  get player() {
    return this.#player;
  }

  #enableAimingOnGameboard() {
    this.#gameboardDiv.obj.enableAiming();
  }

  #showAttackOutcome(msg, { coords, outcome }) {
    this.#gameboardDiv.obj.showAttackOutcome(coords, outcome);
  }

  #initPlayerDiv(player) {
    const div = initDiv(blockName);
    const h3 = this.#initNameDiv(player.name);

    const gameboardCnt = initDiv(getCssClass("gameboardCnt"));
    const gameboardDom = new GameboardDom(player.gameboard);
    this.#gameboardDiv = gameboardDom.div;
    gameboardCnt.append(this.#gameboardDiv);

    div.append(h3, gameboardCnt);

    return div;
  }

  #initNameDiv(name) {
    const h3 = initH3(getCssClass("nameH3"));
    h3.textContent = `${name} - 4 ships`;
    return h3;
  }
}
