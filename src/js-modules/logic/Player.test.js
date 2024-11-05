import Player from "./Player.js";
import Gameboard from "./Gameboard.js";

describe("Player class", () => {
  it("is defined", () => {
    expect(Player).toBeDefined();
  });

  const playerName = "Captain X";
  const sizeGameboard = 10;
  const fleet = [
    ["Carrier", 5],
    ["Battleship", 4],
    ["Cruiser", 3],
    ["Submarine", 3],
    ["Destroyer", 2],
  ];
  const fleetNames = fleet.map((item) => item[0]);

  const player = new Player(playerName, fleet, sizeGameboard);

  it("has a name", () => {
    expect(player.name).toBe(playerName);
  });

  it("has a gameboard", () => {
    expect(player.gameboard).toEqual(new Gameboard(sizeGameboard));
  });

  it("has a fleet", () => {
    expect(player.gameboard.fleet).toEqual(fleetNames);
    expect(player.gameboard.notDeployedFleet).toEqual(fleetNames);
  });

  it("can randomly place the (not deployed) fleet in the board", () => {
    player.randomShipsPlacement();
    expect(player.gameboard.fleet).toEqual(fleetNames);
    expect(player.gameboard.deployedFleet).toEqual(fleetNames);
  });

  it("can randomly place again the deployed fleet in the board", () => {
    // get the old ship placement
    const oldPlacement = new Map();
    player.gameboard.deployedFleet.forEach((shipName) =>
      oldPlacement.set(shipName, player.gameboard.getShipPosition(shipName))
    );

    player.repeatRandomShipsPlacement();

    // get the new ship placement
    const newPlacement = new Map();
    player.gameboard.deployedFleet.forEach((shipName) =>
      newPlacement.set(shipName, player.gameboard.getShipPosition(shipName))
    );

    expect(player.gameboard.fleet).toEqual(fleetNames);
    expect(player.gameboard.deployedFleet).toEqual(fleetNames);
    expect(oldPlacement).not.toEqual(newPlacement);
  });
});
