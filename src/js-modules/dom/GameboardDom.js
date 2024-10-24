import { initDiv } from "../../js-utilities/commonDomComponents";
import CellDom from "./CellDom.js";
import { pubSubTokens } from "../pubSubTokens.js";

const blockName = "gameboard";
const cssClass = {};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

const aimingClass = "aiming";

export default class GameboardDom {
  #div;
  #gameboard;

  constructor(gameboard) {
    this.#gameboard = gameboard;
    this.#div = initGameboardDiv(gameboard);
    this.#div.obj = this;
  }

  // getters
  get div() {
    return this.#div;
  }

  get gameboard() {
    return this.#gameboard;
  }

  enableAiming() {
    this.#div.classList.add(aimingClass);
    this.#div.addEventListener(
      "click",
      this.#getAttackCoordsOnClickCallback.bind(this)
    );
  }

  #getAttackCoordsOnClickCallback(e) {
    // we have subscribed to one event listener for the gameboard: we need to retrieve the appropriate cell
    const targetClassList = e.target.classList;
    if (![...targetClassList].includes("cell")) {
      return;
    }

    e.preventDefault();

    const cellDiv = e.target;
    const cell = cellDiv.obj.cell;

    if (!cell.hasBeenAttacked()) {
      // exit aiming mode
      this.#div.classList.remove(aimingClass);
      this.#div.removeEventListener(
        "click",
        this.#getAttackCoordsOnClickCallback.bind(this)
      );

      PubSub.publish(pubSubTokens.attackCoordsAcquired, cell.coords);
    }
  }
}

// private methods
// if they use 'this', they have to be evoked as: methodName.call(this,args)

function initGameboardDiv(gameboard) {
  const div = initDiv(blockName);

  // Force grid appearance
  div.style.display = "grid";
  div.style.aspectRatio = `${gameboard.nCols}/${gameboard.nRows}`;
  div.style.gridTemplateColumns = `repeat(${gameboard.nCols},minmax(0,1fr))`;
  div.style.gridTemplateRows = `repeat(${gameboard.nRows},minmax(0,1fr))`;

  const cells = gameboard.cells;
  cells.forEach((column) => {
    column.forEach((cell) => {
      const cellDom = new CellDom(cell);
      div.append(cellDom.div);
    });
  });
  return div;
}
