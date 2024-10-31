import Player from "./Player.js";
import { randomInt } from "../../js-utilities/mathUtilities.js";

// The Ai can have different skiils, which define different applied stategies.
//
// - random: chose just a random cell of the board. A target list is kept, and after each attack,
//           the attacked cell is removed from the list.
//
// - huntTarget: chose a random target as a base. However, when you score a hit, add the neighbouring cells
//           which have not been attacked yet to some high priority list. When the high priority list is not
//           empty, chose the next cell to attack among these instead of the global one.
//
// See https://www.datagenetics.com/blog/december32011/
// See https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319

const defaultSkills = "huntTarget";
const arr2str = (arr) => arr.join(",");
const neighboursCellDisplacement = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

export default class AiPlayer extends Player {
  #possibleTargets;
  #highPriorityPossibleTargets;
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
    this.#highPriorityPossibleTargets = new Map();
  }

  #initPlayerSkills() {
    if (this.#skills == "random") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsRandom;
      this.#applyPostAttackActions = this.#applyPostAttackActionsRandom;
    } else if (this.#skills == "huntTarget") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsHuntTarget;
      this.#applyPostAttackActions = this.#applyPostAttackActionsHuntTarget;
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

  #getOpponentTargetCellCoordsRandom(targetMap = this.#possibleTargets) {
    if (targetMap.size === 0) {
      throw new Error("There are no possible opponent targets");
    }

    const idx = randomInt(0, targetMap.size - 1);

    return Array.from(targetMap.values())[idx];
  }

  #applyPostAttackActionsRandom(cellCoords) {
    this.#possibleTargets.delete(arr2str(cellCoords));
  }

  /* hunt-target strategy */

  #getOpponentTargetCellCoordsHuntTarget() {
    // If the high priority targets list is not empty, select one of that
    const targetMap =
      this.#highPriorityPossibleTargets.size > 0
        ? this.#highPriorityPossibleTargets
        : this.#possibleTargets;

    return this.#getOpponentTargetCellCoordsRandom(targetMap);
  }

  #applyPostAttackActionsHuntTarget(cellCoords, outcome) {
    // Delete current cell
    this.#possibleTargets.delete(arr2str(cellCoords));
    this.#highPriorityPossibleTargets.delete(arr2str(cellCoords));

    // If hit, add neighbours target cell to high priority cells
    if (outcome.isHit) {
      const [col, row] = cellCoords;
      neighboursCellDisplacement.forEach(([dCol, dRow]) => {
        // Compute the neighbour cell
        const neighCellCoords = [col + dCol, row + dRow];

        // If the cell is in the possible targets list (ie, not attacked yet),
        // and not yet in the high priority one, move it there
        if (this.#possibleTargets.has(arr2str(neighCellCoords))) {
          this.#possibleTargets.delete(arr2str(neighCellCoords));
          this.#highPriorityPossibleTargets.set(
            arr2str(neighCellCoords),
            neighCellCoords
          );
        }
      });
    }
  }
}
