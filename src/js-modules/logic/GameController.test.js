import GameController from "./GameController.js";

describe("GameController class", () => {
  it("is defined", () => {
    expect(GameController).toBeDefined();
  });

  const player1Name = "player X";
  const player2Name = "player Y";
  const player2AIName = "player AI";

  const gameController2Players = new GameController(
    player1Name,
    player2Name,
    false
  );
  const gameController1Player = new GameController(
    player1Name,
    player2AIName,
    true
  );

  it("initialize players (human or ai) that can be retrieved", () => {
    expect(gameController2Players.player1.name).toEqual(player1Name);
    expect(gameController2Players.player2.name).toEqual(player2Name);

    expect(gameController1Player.player1.name).toEqual(player1Name);
    expect(gameController1Player.player2.name).toEqual(player2AIName);
  });

  it("can deploy the players' fleet", () => {
    const hasAllShipsDeployed = (player) => {
      const gameboard = player.gameboard;
      expect(gameboard.hasDeployedShips()).toBeTruthy();
      expect(gameboard.deployedFleet.length).toBe(gameboard.fleet.length);
    };

    hasAllShipsDeployed(gameController2Players.player1);
    hasAllShipsDeployed(gameController2Players.player2);
    hasAllShipsDeployed(gameController1Player.player1);
    hasAllShipsDeployed(gameController1Player.player2);
  });
});
