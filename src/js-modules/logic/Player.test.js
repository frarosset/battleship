import Player from "./Player.js";

describe("Player class", () => {
  it("is defined", () => {
    expect(Player).toBeDefined();
  });

  const playerName = "Captain X";
  const player = new Player(playerName);

  it("has a name", () => {
    expect(player.name).toBe(playerName);
  });
});
