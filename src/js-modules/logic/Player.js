import Gameboard from "./Gameboard.js";

export default class Player {
  #name;
  #gameboard;

  constructor(name, nColsGameboard = 10, nRowsGameboard = nColsGameboard) {
    this.#name = name;
    this.#gameboard = new Gameboard(nColsGameboard, nRowsGameboard);
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }
}
