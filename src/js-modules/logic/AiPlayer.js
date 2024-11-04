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
// - imporvedHuntTarget: the same as the huntTarget one. However, in hunt mode, not all cells are considered,
//           but just the ones for which: (row + col) % opponentMinShipSize === offset, where opponentMinShipSize
//           is the minimum ship size of the opponent, offset is a number between 0 and opponentMinShipSize-1, such that
//           the set {(row,cols) such that (row + col) % opponentMinShipSize === offset} of target cells has the minimum size.
//
//  - probabilistic: a frequency map is computed considering each possible target cell, counting all the ways an unsunk ship could
//           be placed in there. Note that each possibility is weighted 1. However, if the the ship in a given position crosses
//           N hit cells, the weight is 100^N. This helps prioritizing the cells close to the hit ones.
//
//           The cell with the highest frequency is selected. If there is more than one with the same maximum frequency, one of
//           them is chosen randomly.
//
//           When a cell is attacked it is still removed from the possible targets list. However, its coordinates are saved in a
//           hitTargets list if there is a hit. Once a ship is sunk, its occupied coordinates are removed from hitTargets list.
//
// - improvedProbabilistic: when in target mode (ie, there are hit cells which are not of sunk ships), apply the probabilistic strategy.
//
//           Otherwise, in hunt mode, consider just the selected cells considering parity (see improvedHuntTarget strategy), and in
//           particular their squared frequencies, from which a probability is recomputed. Then, select a random cell among these cells,
//           taking into account such probability. In this way, at the beginning it is more probable to choose a cell in the middle,
//           however, there is no the guarantee to be chosing exactly one of those.
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
  #hitTargets;
  #targetFrequencies;

  constructor(
    name,
    skills = defaultSkills,
    fleet = Player.defaultFleet,
    nColsGameboard = Player.defaultSizeGameboard,
    nRowsGameboard = nColsGameboard
  ) {
    super(name, fleet, nColsGameboard, nRowsGameboard);

    this.#initPossibleTargets();
    if (
      skills === "improvedHuntTarget" ||
      skills === "probabilistic" ||
      skills === "improvedProbabilistic"
    ) {
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
    this.#hitTargets = new Map();
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
    } else if (this.#skills == "probabilistic") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsProbabilistic;
      this.#applyPostAttackActions = this.#applyPostAttackActionsProbabilistic;
    } else if (this.#skills == "improvedProbabilistic") {
      this.#getOpponentTargetCellCoords =
        this.#getOpponentTargetCellCoordsImprovedProbabilistic;
      this.#applyPostAttackActions =
        this.#applyPostAttackActionsImprovedProbabilistic;
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
    const targetMap =
      this.#highPriorityPossibleTargets.size > 0
        ? this.#highPriorityPossibleTargets // target mode
        : this.#selectedPossibleTargets; // hunt mode

    return this.#getOpponentTargetCellCoordsRandom(targetMap);
  }

  #applyPostAttackActionsImprovedHuntTarget(cellCoords, outcome) {
    this.#applyPostAttackActionsHuntTarget(cellCoords, outcome);

    // delete the coords from the selectedPossibleTargets, too
    // there is no need to delete the neighbouring cells if it is a hit,
    // because in target mode you won't be using #selectedPossibleTargets
    this.#selectedPossibleTargets.delete(arr2str(cellCoords));

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

      // If this temporary Map has a smaller size than minMapSize, replace the selectedPossibleTargetsArr and update (reduce) minMapSize
      if (tempMapSize < minMapSize) {
        selectedPossibleTargetsArr = [tempSelectedPossibleTargets];
        minMapSize = tempMapSize;
      } else if (tempMapSize === minMapSize) {
        selectedPossibleTargetsArr.push(tempSelectedPossibleTargets);
      }
    }

    // use a set from selectedPossibleTargetsArr. Choose randomly, as they are equivalent
    const idx = randomInt(0, selectedPossibleTargetsArr.length - 1);
    //console.log(idx, selectedPossibleTargetsArr);
    this.#selectedPossibleTargets = selectedPossibleTargetsArr[idx];
  }

  /* probabilistic strategy */
  #getOpponentTargetCellCoordsProbabilistic() {
    this.#computeCellsProbabilities();

    // get the cells with the maximum probability
    let maxFrequency = 0;
    let maxFrequenciesCoordsKeys = [];

    this.#targetFrequencies.entries().forEach(([key, frequency]) => {
      //console.log(key, frequency);

      if (frequency > maxFrequency) {
        maxFrequenciesCoordsKeys = [key];
        maxFrequency = frequency;
      } else if (frequency === maxFrequency) {
        maxFrequenciesCoordsKeys.push(key);
      }
    });

    // randomly select one cells coords among maxFrequenciesCoordsKeys
    const idx = randomInt(0, maxFrequenciesCoordsKeys.length - 1);

    // console.log(
    //   maxFrequency,
    //   maxFrequenciesCoordsKeys,
    //   idx,
    //   this.#possibleTargets.get(maxFrequenciesCoordsKeys[idx])
    // );

    return this.#possibleTargets.get(maxFrequenciesCoordsKeys[idx]);
  }

  #applyPostAttackActionsProbabilistic(cellCoords, outcome) {
    // Delete current cell from possible targets
    this.#possibleTargets.delete(arr2str(cellCoords));

    // If hit, add cell to hit targets (which does not include sunk ship targets)
    if (outcome.isHit) {
      this.#hitTargets.set(arr2str(cellCoords), cellCoords);
      //console.log("HIT", this.#hitTargets);
    }

    // If sunk, remove ship coords from hit targets (which does not include sunk ship targets)
    if (outcome.isSunk) {
      const sunkShipCoords = outcome.sunkShipCoords[0];

      sunkShipCoords.forEach((coords) =>
        this.#hitTargets.delete(arr2str(coords))
      );
      //console.log("AND SUNK", this.#hitTargets);
    }
  }

  #computeCellsProbabilities() {
    // initialize the frequencies map
    const frequencies = new Map();
    this.#possibleTargets.keys().forEach((key) => frequencies.set(key, 0));

    // for each ship length
    for (const shipSize of this.#opponentShipSizes) {
      // for each possible target
      for (const [col, row] of this.#possibleTargets.values()) {
        // for each possible direction
        forDirection: for (const [dCol, dRow] of neighboursCellDisplacement) {
          const tempCellsKeys = [];
          let hits = 0;
          // const tempStr = `ship of length ${shipSize} in cell (${col},${row}) along ${dRow > 0 ? "S" : dRow < 0 ? "N" : dCol > 0 ? "E" : "W"}`;

          // check if the ship can fit: start from the end, so you could stop early if they overflow
          for (let delta = shipSize - 1; delta >= 0; delta--) {
            const [c, r] = [col + dCol * delta, row + dRow * delta];
            const tempKey = arr2str([c, r]);
            const isHit = this.#hitTargets.has(tempKey);

            // check if the cell could be occupied by this ship
            // ie, either it is in the possible (not-attacked) targets or hit (but unsunk)
            // if not, try next ship direction
            if (!this.#possibleTargets.has(tempKey) && !isHit) {
              // console.log("no", tempStr);
              continue forDirection;
            }

            // if hit, increment the hits counter, else save this cell label
            if (isHit) {
              hits++;
            } else {
              tempCellsKeys.push(tempKey);
            }
          }
          // increment the counter for each cell that would be occupied by the ship
          // note: if there are some hits, this is weighted 100**hits instead of 1.
          //        This helps prioritizing the cells close to the hit ones.
          // note: each ship is counted twice (it can be placed in two opposite directions)

          // const strTempCells = tempCellsKeys.map((key) => `(${key})`);
          // console.log("ALLOWED", tempStr, "-->", ...strTempCells);

          const increment = hits === 0 ? 1 : 100 ** hits;

          tempCellsKeys.forEach((key) => {
            const frequency = frequencies.get(key);
            frequencies.set(key, frequency + increment);
          });
        }
      }
    }

    this.#targetFrequencies = frequencies;
    //console.log(frequencies);
  }

  // improved probabilistic

  #getOpponentTargetCellCoordsImprovedProbabilistic() {
    // in target mode: apply the probabilistic approach
    if (this.#hitTargets.size > 0) {
      return this.#getOpponentTargetCellCoordsProbabilistic();
    }

    // hunt mode: consider just the selected cells (see imporved hunt target approach)
    // consider the this.#selectedPossibleTargets list

    this.#computeCellsProbabilities();

    // get the squared frequencies of the selected targets
    const targetFrequencies = new Map();
    this.#selectedPossibleTargets
      .keys()
      .forEach((key) =>
        targetFrequencies.set(key, this.#targetFrequencies.get(key) ** 2)
      );

    // compute the sum of such selected frequencies
    const sum = targetFrequencies
      .values()
      .reduce((sum, frequency) => sum + frequency, 0);

    // get a cell randomly, taking into account such probabilities
    const rand = randomInt(0, sum - 1);
    let cumsum = 0;

    for (const [key, frequency] of targetFrequencies) {
      //const oldCumsum = cumsum;
      cumsum += frequency;

      if (cumsum > rand) {
        //const str = `(${key}): ${rand + 1} in range [${oldCumsum + 1},${cumsum}] --> ${(frequency / sum) * 100}%`;
        //console.log(str);

        return this.#selectedPossibleTargets.get(key);
      }
    }
  }

  #applyPostAttackActionsImprovedProbabilistic(cellCoords, outcome) {
    this.#applyPostAttackActionsProbabilistic(cellCoords, outcome);

    // delete the coords from the selectedPossibleTargets, too
    this.#selectedPossibleTargets.delete(arr2str(cellCoords));

    // if the ship is sunk, update the opponentMinShipSize
    if (outcome.isSunk) {
      this.#removeOpponentSunkShipSize(outcome.sunkShip.length);
    }
  }
}
