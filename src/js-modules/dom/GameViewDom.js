import { initDiv } from "../../js-utilities/commonDomComponents";
import PlayerDom from "./PlayerDom.js";

const blockName = "game";
const cssClass = {
  playersDiv: "players-div",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class GameViewDom {
  #div;
  #players;

  constructor(player1, player2) {
    this.#players = [new PlayerDom(player1), new PlayerDom(player2)];

    this.#div = initGameViewDiv(...this.#players);
    this.#div.obj = this;
  }

  // getters
  get div() {
    return this.#div;
  }
}

function initGameViewDiv(player1Dom, player2Dom) {
  const div = initDiv(blockName);

  const playersDiv = initDiv(getCssClass("playersDiv"));

  playersDiv.append(player1Dom.div, player2Dom.div);
  div.append(playersDiv);

  return div;
}
