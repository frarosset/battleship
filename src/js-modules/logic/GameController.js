import Player from "./Player.js";
import AiPlayer from "./AiPlayer.js";
import PubSub from "pubsub-js";
import {
  pubSubTokens,
  pubSubTokensUi,
  pubSubTopicUi,
} from "../pubSubTokens.js";

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

  #isAIPlayer() {
    return this.#player instanceof AiPlayer;
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
    this.#consoleLogMessage("startGame");

    // First, subscribe to pubSubTokens.playTurn token to continue playing until moves are allowed
    PubSub.subscribe(pubSubTokens.playTurn, this.#playTurn.bind(this));

    // Play the first turn: this will publish pubSubTokens.playTurn to play new turns
    this.#playTurn();
  }

  #playTurn() {
    this.#consoleLogMessage("startTurn");

    // First, subscribe to the token that perform the attack when its coords are acquired
    PubSub.subscribe(
      pubSubTokens.attackCoordsAcquired,
      this.#attackCoordsAcquiredCallback.bind(this)
    );

    // Get the coords of the move to be done (and publish a attackCoordsAcquired token)
    this.#getAttackCoords();
  }

  #attackCoordsAcquiredCallback(msg, coords) {
    // First, unsubscribe from attackCoordsAcquired token
    PubSub.unsubscribe(pubSubTokens.attackCoordsAcquired);

    // Attack the opponent and get outcome info
    const outcome = this.#attackTheOpponent(coords);

    // Perform actions based on hit or miss outcome (todo)
    this.#consoleLogMessage("attackInfo", { coords, outcome });

    // End the game if the current player wins
    if (outcome.isWin) {
      PubSub.unsubscribe(pubSubTokens.playTurn);
      PubSub.unsubscribe(pubSubTopicUi); // remove all UI PubSub subscriptions
      this.#consoleLogMessage("endGame");
      return;
    }

    // Perform post-attack actions
    this.#applyPostAttackActions(coords);

    // Pass turn to opponent
    this.#switchCurrentPlayer();

    PubSub.publish(pubSubTokens.playTurn);
  }

  #getAttackCoords() {
    // this depends on whether #player is AI or not
    if (this.#isAIPlayer()) {
      const coords = this.#player.getOpponentTargetCellCoords();
      PubSub.publish(pubSubTokens.attackCoordsAcquired, coords);
    } else {
      PubSub.publish(pubSubTokensUi.enableAimingOnGameboard(this.#opponent));
    }
  }

  #attackTheOpponent(coords) {
    // attacks, and returns an object with info about the outcome of the attack
    const outcomeCode = this.#opponent.gameboard.receiveAttack(coords);

    const isHit = outcomeCode > 0;
    const isSunk = outcomeCode == 2;
    const isWin = !this.#opponent.gameboard.hasDeployedShips();

    // The player can only know the hit ship if this gets sunk
    const sunkShip = isSunk
      ? this.#opponent.gameboard.getCell(coords).getShip()
      : null;

    return { isHit, isSunk, isWin, sunkShip };
  }

  #applyPostAttackActions(coords) {
    // this depends on whether #player is AI or not
    if (this.#isAIPlayer()) {
      return this.#player.applyPostAttackActions(coords);
    } else {
      // nothing so far...
    }
  }

  #consoleLogMessage(label, data = {}) {
    // A method for debugging the code

    const messages = {
      startGame: () => `${this.#player.name} starts`,
      startTurn: () => `${this.#player.name}'s turn`,
      attackInfo: ({ coords, outcome }) => {
        const coordsStr = `[${coords[0]},${coords[1]}]`;
        const outcomeStr = `${outcome.isHit ? "hit" : "miss"}${outcome.isSunk ? " and sunk" : ""}`;
        const sunkShip = outcome.isSunk
          ? `ship of size ${outcome.sunkShip.length}`
          : "";
        return `Attacks ${coordsStr} > ${outcomeStr} ${sunkShip}`;
      },
      endGame: () => `${this.#player.name} WINS!`,
    };

    console.log(messages[label](data));
  }
}
