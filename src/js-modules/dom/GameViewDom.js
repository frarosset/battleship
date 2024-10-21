import { initDiv, initP } from "../../js-utilities/commonDomComponents";
import initMainHeader from "./initMainHeader.js";
import PlayerDom from "./PlayerDom.js";

const blockName = "game";
const cssClass = {
  playersDiv: "players-div",
  msgP: "msg-p",
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

  const header = initMainHeader();

  const playersDiv = initDiv(getCssClass("playersDiv"));
  playersDiv.append(player1Dom.div, player2Dom.div);

  const msgP = initGameMsg();

  div.append(header, playersDiv, msgP);

  return div;
}

function initGameMsg() {
  // for now show a temporary msg, to setup the page...the actual message selection is todo
  const msg = "A message to show game status (TODO)";
  return initP(getCssClass("msgP"), null, msg);
}
