import Gameboard from "./Gameboard.js";

describe("Gameboard class", () => {
  const nRows = 10;
  const nCols = 5;
  const gameboard = new Gameboard(nCols, nRows);

  it("is defined", () => {
    expect(Gameboard).toBeDefined();
  });

  it("has a size", () => {
    expect(gameboard.size).toBe([nCols, nRows]);
    expect(gameboard.nCols).toBe(nCols);
    expect(gameboard.nRows).toBe(nRows);
  });
});
