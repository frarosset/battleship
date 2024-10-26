import {
  initDiv,
  initP,
  initButton,
} from "../../js-utilities/commonDomComponents";
import initMainHeader from "./initMainHeader.js";
import PlayerDom from "./PlayerDom.js";
import { pubSubTokensUi } from "../pubSubTokens.js";
import PubSub from "pubsub-js";

const blockName = "game";
const cssClass = {
  playersDiv: "players-div",
  playerDiv: "player-div",
  msgP: "msg-p",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class GameViewDom {
  #div;
  #players;
  #currentPlayer;
  #isAIPlayer;
  #showCurrentPlayerDeployedFleetCallbackBinded;

  constructor(player1, player2) {
    this.#players = [new PlayerDom(player1), new PlayerDom(player2)];

    PubSub.subscribe(
      pubSubTokensUi.playersSwitch,
      (msg, { player, isAIPlayer }) => {
        this.#currentPlayer = player;
        this.#isAIPlayer = isAIPlayer;
      }
    );

    this.#showCurrentPlayerDeployedFleetCallbackBinded =
      this.#showCurrentPlayerDeployedFleetCallback.bind(this);
    this.#div = this.#initGameViewDiv(...this.#players);
    this.#div.obj = this;
  }

  // getters
  get div() {
    return this.#div;
  }

  #initGameViewDiv(player1Dom, player2Dom) {
    const div = initDiv(blockName);

    const header = initMainHeader();
    const showFleetBtn = this.#initShowFleetButton();
    header.append(showFleetBtn);

    const playersDiv = initDiv(getCssClass("playersDiv"));
    const player1Div = initDiv(getCssClass("playerDiv"));
    const player2Div = initDiv(getCssClass("playerDiv"));
    player1Div.append(player1Dom.div);
    player2Div.append(player2Dom.div);
    playersDiv.append(player1Div, player2Div);

    const msgP = this.#initGameMsg();

    div.append(header, playersDiv, msgP);

    return div;
  }

  #initGameMsg() {
    // for now show a temporary msg, to setup the page...the actual message selection is todo
    const msg = "A message to show game status (TODO)";
    return initP(getCssClass("msgP"), null, msg);
  }

  #showCurrentPlayerDeployedFleetCallback() {
    if (!this.#isAIPlayer) {
      PubSub.publish(
        pubSubTokensUi.toggleDeployedFleetShown(this.#currentPlayer)
      );
    }
  }

  #initShowFleetButton() {
    const btn = initButton(
      "btn",
      this.#showCurrentPlayerDeployedFleetCallbackBinded,
      null,
      "Toggle fleet"
    );

    return btn;
  }
}
