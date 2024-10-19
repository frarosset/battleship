import AiPlayer from "./AiPlayer.js";
import Gameboard from "./Gameboard.js";

describe("AiPlayer class", () => {
  it("is defined", () => {
    expect(AiPlayer).toBeDefined();
  });

  const playerName = "Captain AI";
  const opponentName = "Captain Opponent";
  const sizeGameboard = 10;
  const fleet = [
    ["Carrier", 5],
    ["Battleship", 4],
    ["Cruiser", 3],
    ["Submarine", 3],
    ["Destroyer", 2],
  ];
  const fleetNames = fleet.map((item) => item[0]);

  const aiPlayer = new AiPlayer(playerName, fleet, sizeGameboard);
  const opponentPlayer = new AiPlayer(opponentName, fleet, sizeGameboard);

  it("has the characteristics of a normal Player", () => {
    // copy the same tests as Player class
    // has a name
    expect(aiPlayer.name).toBe(playerName);
    //has a gameboard
    expect(aiPlayer.gameboard).toEqual(new Gameboard(sizeGameboard));
    // has a fleet
    expect(aiPlayer.gameboard.fleet).toEqual(fleetNames);
    expect(aiPlayer.gameboard.notDeployedFleet).toEqual(fleetNames);
    // it can randomly place the (not deployed) fleet in the board
    aiPlayer.randomShipsPlacement();
    expect(aiPlayer.gameboard.fleet).toEqual(fleetNames);
    expect(aiPlayer.gameboard.deployedFleet).toEqual(fleetNames);
  });

  it("can chose a valid opponent target cell for the next attack", () => {
    opponentPlayer.randomShipsPlacement();
    const cellCoords = aiPlayer.getOpponentTargetCellCoords();
    expect(opponentPlayer.gameboard.isValidCell(cellCoords)).toBeTruthy();
  });

  it("doesn't propose the same random target cell twice after this has been attacked", () => {
    // a post-attack method is defined which has to be called after an attack
    for (let i = 0; i < sizeGameboard * sizeGameboard; i++) {
      const cellCoords = aiPlayer.getOpponentTargetCellCoords();
      expect(() => {
        const isHit = opponentPlayer.gameboard.receiveAttack(cellCoords);
        aiPlayer.applyPostAttackActions(cellCoords, { isHit });
      }).not.toThrow();
    }
  });
});
