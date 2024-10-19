import Gameboard from "./Gameboard.js";
import { randomInt } from "../../js-utilities/mathUtilities.js";

const defaultSizeGameboard = 10;
const defaultFleet = [
  ["Carrier", 5],
  ["Battleship", 4],
  ["Cruiser", 3],
  ["Submarine", 3],
  ["Destroyer", 2],
];
const allDirections = Gameboard.getAllDirections();

export default class Player {
  #name;
  #gameboard;

  constructor(
    name,
    fleet = defaultFleet,
    nColsGameboard = defaultSizeGameboard,
    nRowsGameboard = nColsGameboard
  ) {
    this.#name = name;
    this.#gameboard = new Gameboard(nColsGameboard, nRowsGameboard);

    fleet.forEach((item) => this.#gameboard.addShip(...item));
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }

  randomShipsPlacement() {
    this.#gameboard.notDeployedFleet.forEach((name) => {
      let cStern, rStern, direction;
      do {
        cStern = randomInt(0, this.#gameboard.nCols - 1);
        rStern = randomInt(0, this.#gameboard.nRows - 1);
        direction = allDirections[randomInt(0, allDirections.length - 1)];
      } while (
        !this.#gameboard.canPlaceShip(name, [cStern, rStern], direction)
      );

      this.#gameboard.placeShip(name, [cStern, rStern], direction);
    });
  }
}
