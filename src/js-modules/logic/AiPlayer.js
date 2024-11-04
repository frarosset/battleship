import Player from "./Player.js";
import { randomInt } from "../../js-utilities/mathUtilities.js";

// The Ai can have different skiils, which define different applied stategies.
//
// - random: choose just a random cell of the board. A target list is kept, and after each attack,
//           the attacked cell is removed from the list.
//
// - huntTarget: choose a random target as a base. However, when you score a hit, add the neighbouring cells
//           which have not been attacked yet to some high priority list. When the high priority list is not
//           empty, chose the next cell to attack among these instead of the global one.
//
//   imporvedHuntTarget: the same as the huntTarget one. However, in hunt mode, not all cells are considered,
//           but just the ones for which: (row + col) % opponentMinShipSize === 0, where opponentMinShipSize
//           is the minimum ship size of the opponent.
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
  #opponentMinShipSize;
  #opponentShipSizes;
  #selectedPossibleTargets;

  constructor(
    name,
    fleet = Player.defaultFleet,
    nColsGameboard = Player.defaultSizeGameboard,
    nRowsGameboard = nColsGameboard,
    skills = defaultSkills
  ) {
    super(name, fleet, nColsGameboard, nRowsGameboard);

    this.#initPossibleTargets();
    if (skills == "improvedHuntTarget") {
      this.#initOpponentShipsSize();
    }
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
    } else if (this.#skills == "improvedHuntTarget") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsImprovedHuntTarget;
      this.#applyPostAttackActions =
        this.#applyPostAttackActionsImprovedHuntTarget;
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
        ? this.#highPriorityPossibleTargets // target mode
        : this.#possibleTargets; // hunt mode

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

  /* improvedHuntTarget strategy */

  #getOpponentTargetCellCoordsImprovedHuntTarget() {
    // If the high priority targets list is not empty, select one of that
    if (this.#highPriorityPossibleTargets.size > 0) {
      // target mode
      const targetMap = this.#highPriorityPossibleTargets;

      return this.#getOpponentTargetCellCoordsRandom(targetMap);
    } else {
      // hunt mode
      const targetMap = this.#possibleTargets;
      while (true) {
        const [row, col] = this.#getOpponentTargetCellCoordsRandom(targetMap);

        if ((row + col) % this.#opponentMinShipSize === 0) {
          return [row, col];
        }
      }
    }
  }

  #applyPostAttackActionsImprovedHuntTarget(cellCoords, outcome) {
    this.#applyPostAttackActionsHuntTarget(cellCoords, outcome);

    // if the ship is sunk, update the opponentMinShipSize
    if (outcome.isSunk) {
      this.#removeOpponentSunkShipSize(outcome.sunkShip.length);
    }
  }

  #initOpponentShipsSize() {
    // The opponent ships' length are the same of the current player... so use this players coordinates
    // Sort the array by ship length (ascending)
    this.#opponentShipSizes = this.gameboard.fleetAsShipObj
      .map((ship) => ship.length)
      .sort((a, b) => a - b);
    this.#updateOpponentMinShipSize();
  }

  #removeOpponentSunkShipSize(size) {
    this.#opponentShipSizes.splice(this.#opponentShipSizes.indexOf(size), 1);
    this.#updateOpponentMinShipSize();
  }

  #updateOpponentMinShipSize() {
    // the minimum is the first element, as it is sorted
    this.#opponentMinShipSize = this.#opponentShipSizes[0];

    console.log(this.#opponentShipSizes, this.#opponentMinShipSize);

    // get the selected possible targets based on this.#opponentMinShipSize
    this.#getSelectedPossibleTargets();
  }

  #getSelectedPossibleTargets() {
    const minShipSize = this.#opponentMinShipSize;

    // initialize the possible targets Map with the full possibleTargets list
    // store it in an array, which will be used to keep track of different sets of the same Map size
    let selectedPossibleTargetsArr = [
      new Map(JSON.parse(JSON.stringify(Array.from(this.#possibleTargets)))),
    ];
    let minMapSize = selectedPossibleTargetsArr[0].size;

    console.log("full:", minMapSize);
    // There are different possible Maps that can be considered, each one with a different offset.
    // The elements in each one are those who fulfill: (row + col) % minShipSize === offset
    for (let offset = 0; offset < minShipSize; offset++) {
      // Create a temporary Map with the possible targets cells fulfilling parity with this offset
      const tempSelectedPossibleTargets = new Map();
      [...this.#possibleTargets.entries()].forEach(([key, [row, col]]) => {
        if ((row + col) % minShipSize === offset) {
          tempSelectedPossibleTargets.set(key, [row, col]);
        }
      });
      const tempMapSize = tempSelectedPossibleTargets.size;

      console.log("offset", offset, tempMapSize, tempSelectedPossibleTargets);

      // If this temporary Map has a smaller size than minMapSize, replace the selectedPossibleTargetsArr and update (reduce) minMapSize
      if (tempMapSize < minMapSize) {
        selectedPossibleTargetsArr = [tempSelectedPossibleTargets];
        minMapSize = tempMapSize;
        console.log("replaced", minMapSize);
      } else if (tempMapSize === minMapSize) {
        selectedPossibleTargetsArr.push(tempSelectedPossibleTargets);
        console.log("append", minMapSize);
      }
    }

    // use a set from selectedPossibleTargetsArr. Choose randomly, as they are equivalent
    const idx = randomInt(0, selectedPossibleTargetsArr.length - 1);
    console.log(idx, selectedPossibleTargetsArr);
    this.#selectedPossibleTargets = selectedPossibleTargetsArr[idx];
  }
}
