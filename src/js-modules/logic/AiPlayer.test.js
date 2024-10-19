import AiPlayer from "./AiPlayer.js";
import Gameboard from "./Gameboard.js";

describe("AiPlayer class", () => {
  it("is defined", () => {
    expect(AiPlayer).toBeDefined();
  });

  const playerName = "Captain AI";
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
});
