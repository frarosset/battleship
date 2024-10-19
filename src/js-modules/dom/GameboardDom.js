import { initDiv } from "../../js-utilities/commonDomComponents";

const blockName = "gameboard";
const cssClass = {};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

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
}

// private methods
// if they use 'this', they have to be evoked as: methodName.call(this,args)

function initGameboardDiv(gameboard) {
  const div = initDiv(blockName);

  const cells = gameboard.cells;
  cells.forEach((column) => {
    column.forEach((cell) => {
      const cellDiv = initDiv("cell");
      cellDiv.textContent = cell.coords;
      div.append(cellDiv);
    });
  });
  return div;
}
