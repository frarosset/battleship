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
  btns: "btns",
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
  #toggleShowMsgCallbackBinded;

  #msgP;

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
    this.#toggleShowMsgCallbackBinded = this.#toggleShowMsgCallback.bind(this);

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
    this.#msgP = msgP;

    div.append(header, playersDiv, msgP);

    return div;
  }

  #initHeader() {
    const header = initHeader(getCssClass("header"));
    // const h1 = initH1(getCssClass("h1"), null, "BATTLESHIP");

    const buttonsDiv = initDiv(getCssClass("btns"));
    const showFleetBtn = this.#initShowFleetButton();
    const toggleShowMsgBtn = this.#initToggleShowMsgButton();

    if (this.#versusAi) {
      showFleetBtn.style.display = "none";
    }

    buttonsDiv.append(showFleetBtn, toggleShowMsgBtn);
    header.append(buttonsDiv);

    return header;
  }

  #initGameMsg() {
    const msg = "...";
    const p = initP(getCssClass("msgP"), null, msg);

    PubSub.subscribe(pubSubTokensUi.setGameStatusMsg, (msg, gameStatusMsg) => {
      p.textContent = gameStatusMsg;
    });

    return p;
  }

  #showCurrentPlayerDeployedFleetCallback() {
    if (!this.#isAIPlayer) {
      PubSub.publish(
        pubSubTokensUi.toggleDeployedFleetShown(this.#currentPlayer)
      );
    }
  }

  #toggleShowMsgCallback() {
    PubSub.publish(pubSubTokensUi.toggleShowMsg);
    this.#msgP.classList.toggle("hidden");
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

  #initToggleShowMsgButton() {
    const btn = initButton(
      "btn",
      this.#toggleShowMsgCallbackBinded.bind(this),
      null,
      "Toggle messages"
    );

    return btn;
  }
}
