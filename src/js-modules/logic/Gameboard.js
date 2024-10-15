import Cell from "./Cell.js";

export default class Gameboard {
  #nCols;
  #nRows;

  constructor(nCols, nRows = nCols) {
    this.#nCols = nCols;
    this.#nRows = nRows;
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
}
