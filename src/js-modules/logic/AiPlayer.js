import Player from "./Player.js";
import { randomInt } from "../../js-utilities/mathUtilities.js";

export default class AiPlayer extends Player {
  #possibleTargets;

  constructor(
    name,
    fleet = Player.defaultFleet,
    nColsGameboard = Player.defaultSizeGameboard,
    nRowsGameboard = nColsGameboard
  ) {
    super(name, fleet, nColsGameboard, nRowsGameboard);

    this.#initPossibleTargets();
  }

  #initPossibleTargets() {
    // The possible targets are defined as the coordinates of the cells, which are the same
    // for both this player and the opponent... so use this players coordinates
    this.#possibleTargets = new Set(
      this.gameboard.cells.flat().map((cell) => cell.coords)
    );
  }

  getOpponentTargetCellCoords() {
    // this is a wrapper and allows to use different strategies in future
    // implementations using the same interface: todo
    return this.#getOpponentTargetCellCoordsRandom();
  }

  applyPostAttackActions(cellCoords, otherData = {}) {
    // this is a wrapper and allows to use different strategies in future
    // implementations using the same interface: todo
    // otherData is set as argument for future improvements
    return this.#applyPostAttackActionsRandom(cellCoords);
  }

  #getOpponentTargetCellCoordsRandom() {
    if (this.#possibleTargets.size === 0) {
      throw new Error("There are no possible opponent targets");
    }
    const idx = randomInt(0, this.#possibleTargets.size - 1);
    return Array.from(this.#possibleTargets)[idx];
  }

  #applyPostAttackActionsRandom(cellCoords) {
    this.#possibleTargets.delete(cellCoords);
  }
}
