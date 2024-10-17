import Cell from "./Cell.js";
import Ship from "./Ship.js";

/* By convention, to place a ship you specify the coordinates of the stern (back of the ship) and the direction (N,E,S,W) */

const directionDisplacement = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};

export default class Gameboard {
  #nCols;
  #nRows;
  #cells;
  #fleet;

  constructor(nCols, nRows = nCols) {
    this.#nCols = nCols;
    this.#nRows = nRows;

    this.#cells = [];
    for (let c = 0; c < nCols; c++) {
      this.#cells.push([]);
      for (let r = 0; r < nRows; r++) {
        const cell = new Cell([c, r]);
        this.#cells[c].push(cell);
      }
    }

    this.#fleet = new Map();
  }

  get size() {
    return [this.#nCols, this.#nRows];
  }

  get nCols() {
    return this.#nCols;
  }

  get nRows() {
    return this.#nRows;
  }

  get fleet() {
    return [...this.#fleet.keys()];
  }

  getCell([c, r]) {
    if (!this.isValidCell([c, r])) {
      throw new Error("The cell is out-of-bound");
    }
    return this.#cells[c][r];
  }

  isValidCell([c, r]) {
    return c >= 0 && c < this.#nCols && r >= 0 && r < this.#nRows;
  }

  hasShip(name) {
    return this.#fleet.has(name);
  }

  addShip(name, length) {
    if (this.hasShip(name)) {
      throw new Error("The ship is already in the fleet");
    }

    const ship = new Ship(length);
    this.#fleet.set(name, ship);
  }

  canPlaceShip(name, [cStern, rStern], direction) {
    const ship = this.#fleet.get(name);

    // if the stern is not in the board, return false (= not placed)
    if (!this.isValidCell([cStern, rStern])) return false;

    // compute the bow
    const [cDispl, rDispl] = directionDisplacement[direction];
    const [cBow, rBow] = [
      cStern + cDispl * (ship.length - 1),
      rStern + rDispl * (ship.length - 1),
    ];

    // if the bow is not in the board, return false (= cannot place)
    if (!this.isValidCell([cBow, rBow])) return false;

    // if the space occupied by the ship is already occupied by other ships, return false (= cannot place)
    for (let i = 0; i < ship.length; i++) {
      const [c, r] = [cStern + cDispl * i, rStern + rDispl * i];
      if (this.#cells[c][r].hasShip()) return false;
    }

    return true;
  }

  placeShip(name, [cStern, rStern], direction) {
    if (!this.canPlaceShip(name, [cStern, rStern], direction)) {
      throw new Error("The ship cannot be placed in this position");
    }

    const ship = this.#fleet.get(name);

    const [cDispl, rDispl] = directionDisplacement[direction];

    for (let i = 0; i < ship.length; i++) {
      const [c, r] = [cStern + cDispl * i, rStern + rDispl * i];
      this.#cells[c][r].placeShip(ship);
    }
  }
}
