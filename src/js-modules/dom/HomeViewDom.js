import {
  initDiv,
  initP,
  initButton,
  initHeader,
  initH1,
} from "../../js-utilities/commonDomComponents";
import { getHomeViewMessage } from "../messages.js";

const blockName = "home";
const cssClass = {
  header: "header",
  titleH1: "title-h2",
  subtitleP: "subtitle-p",
  play1Player: "play-1-player",
  play2Players: "play-2-players",
  playersBtn: "players-btn",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class HomeViewDom {
  #div;

  constructor() {
    const [title, subtitle] = getHomeViewMessage();

    this.#div = this.#initGameViewDiv(title, subtitle);
  }

  // getters
  get div() {
    return this.#div;
  }

  #initGameViewDiv(title, subtitle) {
    const div = initDiv(blockName);

    const header = initHeader(getCssClass("header"));

    const titleH1 = initH1(getCssClass("titleH1"), null, title);
    const subtitleP = initP(getCssClass("subtitleP"), null, subtitle);

    const playersBtn = initDiv(getCssClass("playersBtn"));
    const play1Player = this.#initPlay1Player();
    const play2Players = this.#initPlay2Players();

    header.append(titleH1, subtitleP);
    playersBtn.append(play1Player, play2Players);
    div.append(header, playersBtn);

    return div;
  }

  #initPlay1PlayerCallback() {
    console.log("PLAY WITH 1 PLAYER");
  }
  #initPlay2PlayersCallback() {
    console.log("PLAY WITH 2 PLAYERS");
  }

  #initPlay1Player() {
    const btn = initButton(
      getCssClass("play1Player"),
      this.#initPlay1PlayerCallback,
      null,
      "1 PLAYER"
    );

    return btn;
  }

  #initPlay2Players() {
    const btn = initButton(
      getCssClass("play2Players"),
      this.#initPlay2PlayersCallback,
      null,
      "2 PLAYERS"
    );

    return btn;
  }
}
