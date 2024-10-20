import "./index.css";
import Player from "./js-modules/logic/Player.js";
import GameViewDom from "./js-modules/dom/GameViewDom.js";

// temporary code
const player = new Player("Captain X");
player.randomShipsPlacement();
player.gameboard.receiveAttack([0, 0]);
player.gameboard.receiveAttack([2, 4]);
player.gameboard.receiveAttack([1, 7]);
player.gameboard.receiveAttack([5, 2]);
player.gameboard.receiveAttack([7, 8]);
const player2 = new Player("Captain Y");
player2.randomShipsPlacement();

const gameViewDom = new GameViewDom(player, player2);

document.body.append(gameViewDom.div);
