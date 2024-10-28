import GameController from "./logic/GameController.js";
import GameViewDom from "./dom/GameViewDom.js";
import GameEndViewDom from "./dom/GameEndViewDom.js";
import PubSub from "pubsub-js";
import { pubSubTokens } from "./pubSubTokens.js";
import { removeDescendants } from "../js-utilities/commonDomUtilities.js";

const container = document.body;

export default function initWebpage() {
  // temporary code: a proper external dom structure is to be initialized

  const player1Name = "Captain X";
  const player2Name = "Captain Y";
  const versusAi = true;

  PubSub.subscribe(pubSubTokens.showGameView, renderGameViewDom);
  PubSub.subscribe(pubSubTokens.showGameEndView, renderGameEndViewDom);

  // call this after having subscribed to the above
  new GameController(player1Name, player2Name, versusAi);
}

function renderGameViewDom(token, { player1, player2 }) {
  console.log(`${token} - ${player1.name} vs ${player2.name}`);
  removeDescendants(container);
  const gameViewDom = new GameViewDom(player1, player2);
  container.append(gameViewDom.div);
  // Notify the initialization of the page
  PubSub.publish(pubSubTokens.gameViewInitialized);
}

function renderGameEndViewDom(
  token,
  { winnerPlayerName, defeatedPlayerName, versusAi, isWinnerAi }
) {
  console.log(`${token} - ${winnerPlayerName} wins over ${defeatedPlayerName}`);
  removeDescendants(container);
  const gameEndViewDom = new GameEndViewDom(
    winnerPlayerName,
    defeatedPlayerName,
    versusAi,
    isWinnerAi
  );
  container.append(gameEndViewDom.div);
}
