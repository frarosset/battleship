import Player from "./Player.js";
import { randomInt } from "../../js-utilities/mathUtilities.js";

const defaultSkills = "random";
const arr2str = (arr) => arr.join(",");

export default class AiPlayer extends Player {
  #possibleTargets;
  #skills;
  #getOpponentTargetCellCoords; // methods initalized based on the #skills
  #applyPostAttackActions; // methods initalized based on the #skills

  constructor(
    name,
    fleet = Player.defaultFleet,
    nColsGameboard = Player.defaultSizeGameboard,
    nRowsGameboard = nColsGameboard,
    skills = defaultSkills
  ) {
    super(name, fleet, nColsGameboard, nRowsGameboard);

    this.#initPossibleTargets();
    this.#skills = skills;
    this.#initPlayerSkills();
  }

  #initPossibleTargets() {
    // The possible targets are defined as the coordinates of the cells, which are the same
    // for both this player and the opponent... so use this players coordinates
    this.#possibleTargets = new Map(
      this.gameboard.cells
        .flat()
        .map((cell) => [arr2str(cell.coords), cell.coords])
    );
  }

  #initPlayerSkills() {
    if (this.#skills == "random") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsRandom;
      this.#applyPostAttackActions = this.#applyPostAttackActionsRandom;
    }
  }

  getOpponentTargetCellCoords() {
    // this is a wrapper and allows to use different strategies in future
    // implementations using the same interface: todo
    return this.#getOpponentTargetCellCoords();
  }

  applyPostAttackActions(cellCoords, outcome = {}) {
    // this is a wrapper and allows to use different strategies in future
    // implementations using the same interface: todo
    // outcome is set as argument for future improvements
    return this.#applyPostAttackActions(cellCoords, outcome);
  }

  /* random strategy */

  #getOpponentTargetCellCoordsRandom() {
    if (this.#possibleTargets.size === 0) {
      throw new Error("There are no possible opponent targets");
    }

    const idx = randomInt(0, this.#possibleTargets.size - 1);

    return Array.from(this.#possibleTargets.values())[idx];
  }

  #applyPostAttackActionsRandom(cellCoords) {
    this.#possibleTargets.delete(arr2str(cellCoords));
  }
}
