import { initDiv } from "../../js-utilities/commonDomComponents";

const blockName = "cell";
const cssClass = {};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class CellDom {
  #div;
  #cell;

  constructor(cell) {
    this.#cell = cell;
    this.#div = initCellDiv(cell);
    this.#div.obj = this;

    // temporarily mark the ships // todo: remove
    markShip.call(this);
  }

  // getters
  get div() {
    return this.#div;
  }

  get cell() {
    return this.#cell;
  }
}

// private methods
// if they use 'this', they have to be evoked as: methodName.call(this,args)

function initCellDiv(cell) {
  const div = initDiv(blockName);
  div.style.gridCol = cell.x + 1;
  div.style.gridRow = cell.y + 1;
  div.style.aspectRatio = 1;
  div.style.border = "1px solid darkblue"; //temporary
  return div;
}

function markShip() {
  if (this.cell.hasShip()) {
    this.div.textContent = "#";
  }
}
