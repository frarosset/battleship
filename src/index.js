import "./index.css";
import Player from "./js-modules/logic/Player.js";
import PlayerDom from "./js-modules/dom/PlayerDom.js";

// temporary code
const player = new Player("Captain X");
player.randomShipsPlacement();

const playerDom = new PlayerDom(player);

document.body.append(playerDom.div);
