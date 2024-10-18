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
  #deployedFleet;
  #notDeployedFleet;
  #sunkFleet;

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

    this.#deployedFleet = new Map();
    this.#notDeployedFleet = new Map();
    this.#sunkFleet = new Map();
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

  get deployedFleet() {
    return [...this.#deployedFleet.keys()];
  }

  get notDeployedFleet() {
    return [...this.#notDeployedFleet.keys()];
  }

  get sunkFleet() {
    return [...this.#sunkFleet.keys()];
  }

  get fleet() {
    return [...this.deployedFleet, ...this.notDeployedFleet, ...this.sunkFleet];
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

  hasDeployedShip(name) {
    return this.#deployedFleet.has(name);
  }

  hasNotDeployedShip(name) {
    return this.#notDeployedFleet.has(name);
  }

  hasSunkShip(name) {
    return this.#sunkFleet.has(name);
  }

  hasShip(name) {
    return (
      this.hasDeployedShip(name) ||
      this.hasNotDeployedShip(name) ||
      this.hasSunkShip(name)
    );
  }

  hasDeployedShips() {
    return this.#deployedFleet.size > 0;
  }

  hasNotDeployedShips() {
    return this.#notDeployedFleet.size > 0;
  }

  addShip(name, length) {
    if (this.hasShip(name)) {
      throw new Error("The ship is already in the fleet");
    }

    const ship = new Ship(length);
    this.#notDeployedFleet.set(name, ship);
  }

  canPlaceShip(name, [cStern, rStern], direction) {
    // you can place a ship only if it is in the not deployed fleet
    if (!this.hasNotDeployedShip(name)) return false;

    const ship = this.#notDeployedFleet.get(name);

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

    // you can place a ship only if it is not deployed
    const ship = this.#notDeployedFleet.get(name);

    const [cDispl, rDispl] = directionDisplacement[direction];

    for (let i = 0; i < ship.length; i++) {
      const [c, r] = [cStern + cDispl * i, rStern + rDispl * i];
      this.#cells[c][r].placeShip(ship);
    }

    // move the ship from the not deployed fleet to the deployed fleet
    this.#notDeployedFleet.delete(name);
    this.#deployedFleet.set(name, ship);
  }

  /* Attack functions */
  receiveAttack([c, r]) {
    const cell = this.getCell([c, r]);
    const isHit = cell.receiveAttack();

    const ship = cell.getShip();
    if (isHit && ship != null && ship.isSunk()) {
      // get the name of the ship
      const name = getMapKey(this.#deployedFleet, ship);
      this.#deployedFleet.delete(name);
      this.#sunkFleet.set(name, ship);
    }

    return isHit;
  }
}

function getMapKey(map, val) {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
  return null;
}
