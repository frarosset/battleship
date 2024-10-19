import Player from "./Player.js";

export default class AiPlayer extends Player {
  constructor(
    name,
    fleet = Player.defaultFleet,
    nColsGameboard = Player.defaultSizeGameboard,
    nRowsGameboard = nColsGameboard
  ) {
    super(name, fleet, nColsGameboard, nRowsGameboard);
  }
}
