import Player from "./Player.js";
import Gameboard from "./Gameboard.js";

describe("Player class", () => {
  it("is defined", () => {
    expect(Player).toBeDefined();
  });

  const sizeGameboard = 10;

  const playerName = "Captain X";
  const player = new Player(playerName, sizeGameboard);

  it("has a name", () => {
    expect(player.name).toBe(playerName);
  });

  it("has a gameboard", () => {
    expect(player.gameboard).toEqual(new Gameboard(sizeGameboard));
  });
});
