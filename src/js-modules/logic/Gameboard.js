import Cell from "./Cell.js";
import Ship from "./Ship.js";

/* By convention, to place a ship you specify the coordinates of the stern (back of the ship) and the direction (N,E,S,W) */

const directionDisplacement = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};
const directionNext = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

export default class Gameboard {
  #nCols;
  #nRows;
  #cells;
  #deployedFleet;
  #notDeployedFleet;
  #sunkFleet;
  #fleetPosition;
  #shipOnMoveData;

  static getAllDirections() {
    return Object.keys(directionDisplacement);
  }

  constructor(nCols = 10, nRows = nCols) {
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
    this.#fleetPosition = new Map();
    this.#shipOnMoveData = null;
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

  get cells() {
    return this.#cells;
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

  get deployedFleetAsShipObj() {
    return [...this.#deployedFleet.values()];
  }

  get notDeployedFleetAsShipObj() {
    return [...this.#notDeployedFleet.values()];
  }

  get sunkFleetAsShipObj() {
    return [...this.#sunkFleet.values()];
  }

  get fleetAsShipObj() {
    return [
      ...this.deployedFleetAsShipObj,
      ...this.notDeployedFleetAsShipObj,
      ...this.sunkFleetAsShipObj,
    ];
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

    const ship = new Ship(length, name);
    this.#notDeployedFleet.set(name, ship);
    this.#fleetPosition.set(name, null);
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

  resetShip(name) {
    if (!this.hasDeployedShip(name)) {
      throw new Error("The ship is not depolyed.");
    }

    // you can reset a ship only if it is deployed
    const ship = this.#deployedFleet.get(name);

    // reset the cells
    const cellCoords = this.#fleetPosition.get(name)[0];
    cellCoords.forEach(([c, r]) => this.#cells[c][r].removeShip(ship));

    // move the ship from the deployed fleet to the not deployed fleet
    this.#deployedFleet.delete(name);
    this.#notDeployedFleet.set(name, ship);
    this.#fleetPosition.set(name, null);
  }

  rotateShip(name, centerOfRotation = null) {
    if (!this.hasDeployedShip(name)) {
      throw new Error("The ship is not depolyed.");
    }

    // get the old position
    const [cellCoords, direction] = this.#fleetPosition.get(name);

    // compute the center of rotation coordinates
    const [centerCol, centerRow] =
      centerOfRotation == null ? cellCoords[0] : centerOfRotation;

    // compute the offset of the center of rotation from the stern
    const offset = cellCoords.findIndex(
      ([col, row]) => col === centerCol && row === centerRow
    );

    // reset the ship (remove it from the gameboard)
    this.resetShip(name);

    // find a direction where you could place the rotate ship
    // note that this loop is finite, since at most you return to the original direction
    let newDirection = direction;
    let sternCoords;
    do {
      newDirection = directionNext[newDirection];
      const [cDispl, rDispl] = directionDisplacement[newDirection];

      // you also need to find the updated stern coordinates
      sternCoords = [centerCol - offset * cDispl, centerRow - offset * rDispl];
    } while (!this.canPlaceShip(name, sternCoords, newDirection));

    // place the rotated ship
    this.placeShip(name, sternCoords, newDirection);
  }

  startMoveShip(name) {
    if (!this.hasDeployedShip(name)) {
      throw new Error("The ship is not depolyed.");
    }

    // get the current ship position and direction
    const [cellCoords, direction] = this.#fleetPosition.get(name);
    const sternCoords = cellCoords[0];

    // save the current ship stern position and direction
    this.#shipOnMoveData = { sternCoords, direction };

    // reset the ship (remove it from the gameboard)
    this.resetShip(name);
  }

  endMoveShip(name, newSternCoords = null) {
    // NOTE: this assumes no other ship is deployed/edited in the original ship position between startMoveShip() and this this method call

    // get the saved ship stern position and direction from #shipOnMoveData and then reset #shipOnMoveData
    const { sternCoords, direction } = this.#shipOnMoveData;
    this.#shipOnMoveData = null;

    // if you can't place it in the new position... restore the old one
    const nextSternCoords =
      newSternCoords && this.canPlaceShip(name, newSternCoords, direction)
        ? newSternCoords
        : sternCoords;

    // place the ship in the new position
    this.placeShip(name, nextSternCoords, direction);
  }

  placeShip(name, [cStern, rStern], direction) {
    if (!this.canPlaceShip(name, [cStern, rStern], direction)) {
      throw new Error("The ship cannot be placed in this position");
    }

    // you can place a ship only if it is not deployed
    const ship = this.#notDeployedFleet.get(name);

    const [cDispl, rDispl] = directionDisplacement[direction];

    const cellCoords = [];

    for (let i = 0; i < ship.length; i++) {
      const [c, r] = [cStern + cDispl * i, rStern + rDispl * i];
      this.#cells[c][r].placeShip(ship);
      cellCoords.push([c, r]);
    }

    // move the ship from the not deployed fleet to the deployed fleet
    this.#notDeployedFleet.delete(name);
    this.#deployedFleet.set(name, ship);
    this.#fleetPosition.set(name, [cellCoords, direction]);
  }

  getShipPosition(name) {
    if (!this.hasShip(name)) {
      throw new Error("The ship is not in the fleet");
    }
    return this.#fleetPosition.get(name);
  }

  /* Attack functions */
  receiveAttack([c, r]) {
    // returns the outcomeCode:
    // 0 (falsy): miss
    // 1 (truthy): hit
    // 2 (truthy): hit and sunk

    const cell = this.getCell([c, r]);
    const isHit = cell.receiveAttack();

    if (isHit) {
      const ship = cell.getShip();
      if (ship.isSunk()) {
        // get the name of the ship
        const name = ship.name;
        this.#deployedFleet.delete(name);
        this.#sunkFleet.set(name, ship);
        return 2;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }
}
