export default class Ship {
  #name;
  #length;
  #hits;

  constructor(length, name = "") {
    this.#name = name;
    this.#length = length;
    this.#hits = 0;
  }

  get name() {
    return this.#name;
  }

  get length() {
    return this.#length;
  }

  get hits() {
    return this.#hits;
  }

  hit() {
    if (this.isSunk()) {
      throw new Error("The ship is already sunk");
    }
    this.#hits++;
  }

  isSunk() {
    return this.#hits === this.length;
  }
}
