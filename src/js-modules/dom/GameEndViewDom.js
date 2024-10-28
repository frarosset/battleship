import {
  initDiv,
  initP,
  initButton,
  initHeader,
  initH2,
} from "../../js-utilities/commonDomComponents";
import { getGameEndMessage } from "../messages.js";
import { pubSubTokens } from "../pubSubTokens.js";
import PubSub from "pubsub-js";

const blockName = "game-end";
const cssClass = {
  header: "header",
  titleH2: "title-h2",
  subtitleP: "subtitle-p",
  playAgainBtn: "play-again-btn",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class GameEndViewDom {
  #div;

  constructor(winnerPlayerName, defeatedPlayerName, versusAi, isWinnerAi) {
    const [title, subtitle] = getGameEndMessage(
      winnerPlayerName,
      defeatedPlayerName,
      versusAi,
      isWinnerAi
    );

    this.#div = this.#initGameViewDiv(title, subtitle);

    const typeOfWinnerClass = versusAi
      ? isWinnerAi
        ? "defeated-1p"
        : "winner-1p"
      : "winner-2p";
    this.#div.classList.add(typeOfWinnerClass);
  }

  // getters
  get div() {
    return this.#div;
  }

  #initGameViewDiv(title, subtitle) {
    const div = initDiv(blockName);

    const header = initHeader(getCssClass("header"));

    const titleH2 = initH2(getCssClass("titleH2"), null, title);
    const subtitleP = initP(getCssClass("subtitleP"), null, subtitle);

    const playAgainBtn = this.#initPlayAgainBtn();

    header.append(titleH2, subtitleP);
    div.append(header, playAgainBtn);

    return div;
  }

  #initPlayAgainBtnCallback() {
    PubSub.publish(pubSubTokens.showHomeView);
  }

  #initPlayAgainBtn() {
    const btn = initButton(
      getCssClass("playAgainBtn"),
      this.#initPlayAgainBtnCallback,
      null,
      "PLAY AGAIN"
    );

    return btn;
  }
}
