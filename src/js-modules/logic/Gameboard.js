import Cell from "./Cell.js";

export default class Gameboard {
  #nCols;
  #nRows;
  #cells;

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

  getCell([c, r]) {
    return this.#cells[c][r];
  }
}
