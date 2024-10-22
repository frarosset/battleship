import Player from "./Player.js";
import AiPlayer from "./AiPlayer.js";
import PubSub from "pubsub-js";
import { pubSubTokens } from "../pubSubTokens.js";

export default class GameController {
  #player1;
  #player2;

  #player; // current player
  #opponent; // current opponent

  constructor(player1Name, player2Name, versusAi = true) {
    // create the players
    this.#player1 = this.#initPlayer(player1Name, false);
    this.#player2 = this.#initPlayer(player2Name, versusAi);

    this.#initGame();
  }

  /* Players methods */

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

  #initCurrentPlayer() {
    // TODO: randomly select first player
    this.#player = this.#player1;
    this.#opponent = this.#player2;
  }

  #switchCurrentPlayer() {
    [this.#player, this.#opponent] = [this.#opponent, this.#player];
  }

  /* Gameplay methods */

  #initGame() {
    this.#deployFleets();
    this.#initGameView();
  }

  #deployFleets() {
    // TODO: let the user place the fleet
    this.player1.randomShipsPlacement();
    this.player2.randomShipsPlacement();
  }

  #initGameView() {
    // First subscribe to the token that notifies when the next action should be performed
    PubSub.subscribe(
      pubSubTokens.gameViewInitialized,
      this.#playGame.bind(this)
    );

    // Publish the token that triggers the expected action
    PubSub.publish(pubSubTokens.initGameView, {
      player1: this.#player1,
      player2: this.#player2,
    });
  }

  #playGame() {
    // Unsubscribe from the token which triggers this function call
    PubSub.unsubscribe(pubSubTokens.gameViewInitialized);

    this.#initCurrentPlayer();
    console.log(`${this.#player.name} starts`);

    while (true) this.#playMove();
  }

  #playMove() {}
}
