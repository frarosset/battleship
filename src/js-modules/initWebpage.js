import HomeViewDom from "./dom/HomeViewDom.js";
import PlayersNameViewDom from "./dom/PlayersNameViewDom.js";
import GameViewDom from "./dom/GameViewDom.js";
import DeployFleetViewDom from "./dom/DeployFleetViewDom.js";
import GameEndViewDom from "./dom/GameEndViewDom.js";
import PubSub from "pubsub-js";
import { pubSubTokens } from "./pubSubTokens.js";
import { resetContent } from "../js-utilities/commonDomUtilities.js";
import setCreditFooter from "../js-utilities/creditFooter.js";
import initMainFooter from "./dom/initMainFooter.js";

let container;

export default function initWebpage() {
  container = document.createElement("main");
  const mainFooter = initMainFooter();
  document.body.append(container, mainFooter);

  setCreditFooter();

  PubSub.subscribe(pubSubTokens.showDeployFleetView, renderDeployFleetViewDom);
  PubSub.subscribe(pubSubTokens.showGameView, renderGameViewDom);
  PubSub.subscribe(pubSubTokens.showGameEndView, renderGameEndViewDom);
  PubSub.subscribe(pubSubTokens.showHomeView, renderHomeViewDom);
  PubSub.subscribe(pubSubTokens.showPlayersNameView, renderPlayersNameViewDom);

  // initialize the page with the home view
  renderHomeViewDom();
}

function renderGameViewDom(token, { player1, player2, versusAi }) {
  console.log(`${token} - ${player1.name} vs ${player2.name}`);
  const gameViewDom = new GameViewDom(player1, player2, versusAi);
  resetContent(container, gameViewDom.div);

  // Notify the initialization of the page
  PubSub.publish(pubSubTokens.gameViewInitialized);
}

function renderDeployFleetViewDom(token, { player, isAi }) {
  console.log(`${token} - ${player.name} ${isAi ? "(AI)" : ""}`);
  const deployFleetViewDom = new DeployFleetViewDom(player, isAi);
  resetContent(container, deployFleetViewDom.div);
}

function renderGameEndViewDom(
  token,
  { winnerPlayerName, defeatedPlayerName, versusAi, isWinnerAi }
) {
  console.log(`${token} - ${winnerPlayerName} wins over ${defeatedPlayerName}`);
  const gameEndViewDom = new GameEndViewDom(
    winnerPlayerName,
    defeatedPlayerName,
    versusAi,
    isWinnerAi
  );
  resetContent(container, gameEndViewDom.div);
}

function renderHomeViewDom(token = "") {
  console.log(`${token}`);
  const homeViewDom = new HomeViewDom();
  resetContent(container, homeViewDom.div);
}

function renderPlayersNameViewDom(token, { versusAi }) {
  console.log(`${token}`);
  const playersNameViewDom = new PlayersNameViewDom(versusAi);
  resetContent(container, playersNameViewDom.div);
}
