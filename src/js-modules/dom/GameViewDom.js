import {
  initDiv,
  initP,
  initButton,
  initHeader,
} from "../../js-utilities/commonDomComponents";
import PlayerDom from "./PlayerDom.js";
import { pubSubTokensUi } from "../pubSubTokens.js";
import PubSub from "pubsub-js";

const blockName = "game";
const cssClass = {
  header: "header",
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
  #versusAi;
  #showCurrentPlayerDeployedFleetCallbackBinded;

  constructor(player1, player2, versusAi) {
    this.#players = [new PlayerDom(player1), new PlayerDom(player2)];
    this.#versusAi = versusAi;

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

    const header = this.#initHeader();

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

  #initHeader() {
    const header = initHeader(getCssClass("header"));
    // const h1 = initH1(getCssClass("h1"), null, "BATTLESHIP");
    const showFleetBtn = this.#initShowFleetButton();

    if (this.#versusAi) {
      showFleetBtn.style.visibility = "hidden";
    }

    header.append(showFleetBtn);
    return header;
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
      "Toggle my fleet"
    );

    return btn;
  }
}
