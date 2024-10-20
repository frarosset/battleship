import "./index.css";
import Player from "./js-modules/logic/Player.js";
import PlayerDom from "./js-modules/dom/PlayerDom.js";

// temporary code
const player = new Player("Captain X");
player.randomShipsPlacement();
player.gameboard.receiveAttack([0, 0]);
player.gameboard.receiveAttack([2, 4]);
player.gameboard.receiveAttack([1, 7]);
player.gameboard.receiveAttack([5, 2]);
player.gameboard.receiveAttack([7, 8]);

const playerDom = new PlayerDom(player);

document.body.append(playerDom.div);
