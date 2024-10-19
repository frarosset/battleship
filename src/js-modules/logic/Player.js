import Gameboard from "./Gameboard.js";

const defaultSizeGameboard = 10;
const defaultFleet = [
  ["Carrier", 5],
  ["Battleship", 4],
  ["Cruiser", 3],
  ["Submarine", 3],
  ["Destroyer", 2],
];

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
}
