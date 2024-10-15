export default class Cell {
  #coords;
  #ship;

  constructor(coords) {
    this.#coords = coords;
    this.#ship = null;
  }

  get coords() {
    return this.#coords;
  }

  get x() {
    return this.#coords[0];
  }

  get y() {
    return this.#coords[1];
  }

  placeShip(ship) {
    this.#ship = ship;
  }

  hasShip() {
    return this.#ship !== null;
  }

  getShip() {
    return this.#ship;
  }
}
