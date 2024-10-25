import { initDiv } from "../../js-utilities/commonDomComponents";

export default class PlaceableObjectDom {
  #div;
  static blockName = "placeable-object";
  static zIndex = 0;

  constructor(cellsCoords) {
    this.#div = this.#initObjectDiv(cellsCoords);
  }

  get div() {
    return this.#div;
  }

  #initObjectDiv(cellsCoords) {
    const div = initDiv(this.constructor.blockName);
    this.#setGridLocation(div, cellsCoords);
    return div;
  }

  #setGridLocation(div, cellsCoords) {
    const minCol = cellsCoords.reduce(
      (min, itm) => (itm[0] < min ? itm[0] : min),
      cellsCoords[0][0]
    );
    const minRow = cellsCoords.reduce(
      (min, itm) => (itm[1] < min ? itm[1] : min),
      cellsCoords[0][1]
    );
    const maxCol = cellsCoords.reduce(
      (min, itm) => (itm[0] > min ? itm[0] : min),
      cellsCoords[0][0]
    );
    const maxRow = cellsCoords.reduce(
      (min, itm) => (itm[1] > min ? itm[1] : min),
      cellsCoords[0][1]
    );

    div.style.gridColumn = `${minCol + 1} / ${maxCol + 2}`;
    div.style.gridRow = `${minRow + 1} / ${maxRow + 2}`;
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.zIndex = this.constructor.zIndex;
    div.style.aspectRatio = `${maxCol - minCol + 1} / ${maxRow - minRow + 1}`;
  }
}
