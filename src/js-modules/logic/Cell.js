export default class Cell {
  #coords;

  constructor(coords) {
    this.#coords = coords;
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
}
