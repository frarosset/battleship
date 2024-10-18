export default class Cell {
  #coords;
  #ship;
  #hasBeenAttacked;

  constructor(coords) {
    this.#coords = coords;
    this.#ship = null;
    this.#hasBeenAttacked = false;
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

  receiveAttack() {
    this.#hasBeenAttacked = true;
    if (this.hasShip()) {
      this.getShip().hit();
      return true;
    } else {
      return false;
    }
  }

  hasBeenAttacked() {
    return this.#hasBeenAttacked;
  }
}
