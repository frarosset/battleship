import { initDiv } from "../../js-utilities/commonDomComponents";

const blockName = "cell";

export default class CellDom {
  #div;
  #cell;

  constructor(cell) {
    this.#cell = cell;
    this.#div = initCellDiv(cell);
    this.#div.obj = this;

    // temporarily mark the ships // todo: remove
    markShip.call(this);
    this.setAttackedStatus();
  }

  // getters
  get div() {
    return this.#div;
  }

  get cell() {
    return this.#cell;
  }

  setAttackedStatus() {
    if (this.cell.hasBeenAttacked()) {
      if (this.cell.hasShip()) {
        this.div.classList.add("hit");
      } else {
        this.div.classList.add("miss");
      }
    }
  }
}

// private methods
// if they use 'this', they have to be evoked as: methodName.call(this,args)

function initCellDiv(cell) {
  const div = initDiv(blockName);
  div.style.gridColumn = cell.x + 1;
  div.style.gridRow = cell.y + 1;
  div.style.aspectRatio = 1;
  return div;
}

function markShip() {
  if (this.cell.hasShip()) {
    this.div.textContent = "#";
  }
}
