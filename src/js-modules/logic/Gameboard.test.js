import Gameboard from "./Gameboard.js";

describe("Gameboard class", () => {
  const nRows = 10;
  const nCols = 5;
  const gameboard = new Gameboard(nCols, nRows);

  const sampleCoordsArrIn = [
    [0, 0],
    [3, 6],
    [nCols - 1, nRows - 1],
  ];
  const sampleCoordsArrOut = [
    [nCols, nRows],
    [nCols, 0],
    [0, nRows],
    [-1, -1],
  ];

  it("is defined", () => {
    expect(Gameboard).toBeDefined();
  });

  it("has a size", () => {
    expect(gameboard.size).toEqual([nCols, nRows]);
    expect(gameboard.nCols).toBe(nCols);
    expect(gameboard.nRows).toBe(nRows);
  });

  it("is composed by cells that can be retrieved", () => {
    sampleCoordsArrIn.forEach((sampleCoords) =>
      expect(gameboard.getCell(sampleCoords).coords).toEqual(sampleCoords)
    );
  });

  it("can say if a cell is valid or out-of-bound", () => {
    sampleCoordsArrIn.forEach((sampleCoords) =>
      expect(gameboard.isValidCell(sampleCoords)).toBeTruthy()
    );
    sampleCoordsArrOut.forEach((sampleCoords) =>
      expect(gameboard.isValidCell(sampleCoords)).toBeFalsy()
    );
  });
});
