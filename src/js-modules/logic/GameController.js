import Player from "./Player.js";
import AiPlayer from "./AiPlayer.js";

export default class GameController {
  #player1;
  #player2;

  constructor(player1Name, player2Name, versusAi = true) {
    // create the players
    this.#player1 = this.#initPlayer(player1Name, false);
    this.#player2 = this.#initPlayer(player2Name, versusAi);
  }

  get player1() {
    return this.#player1;
  }
  get player2() {
    return this.#player2;
  }

  #initPlayer(name, isAi = false) {
    if (isAi) {
      return new AiPlayer(name);
    } else {
      return new Player(name);
    }
  }
}
