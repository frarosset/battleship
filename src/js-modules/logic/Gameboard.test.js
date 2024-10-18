import Gameboard from "./Gameboard.js";

/* By convention, to place a ship you specify the coordinates of the stern (back of the ship) and the direction (N,E,S,W) */

describe("Gameboard class", () => {
  const nRows = 10;
  const nCols = 5;
  const gameboard = new Gameboard(nCols, nRows);

  const sampleCellCoordsArrIn = [
    [0, 0],
    [3, 6],
    [nCols - 1, nRows - 1],
  ];
  const sampleCellCoordsArrOut = [
    [nCols, nRows],
    [nCols, 0],
    [0, nRows],
    [-1, -1],
  ];

  const shipName1 = "My first ship";
  const shipLen1 = 4;

  const shipName2 = "My second ship";
  const shipLen2 = 2;

  const sampleShipCoordsArrIn = [
    [[1, 3], "N"],
    [[1, 3], "E"],
    [[1, 3], "S"],
  ];
  const sampleShipCoordsArrOut = [
    [[1, 3], "W"],
    [[-1, 0], "E"],
    [[-1, 0], "W"],
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
    sampleCellCoordsArrIn.forEach((sampleCoords) =>
      expect(gameboard.getCell(sampleCoords).coords).toEqual(sampleCoords)
    );
  });

  it("can say if a cell is valid or out-of-bound", () => {
    sampleCellCoordsArrIn.forEach((sampleCoords) =>
      expect(gameboard.isValidCell(sampleCoords)).toBeTruthy()
    );
    sampleCellCoordsArrOut.forEach((sampleCoords) =>
      expect(gameboard.isValidCell(sampleCoords)).toBeFalsy()
    );
  });

  it("throws an error if you try to retrieve an out-of-bound cell", () => {
    sampleCellCoordsArrOut.forEach((sampleCoords) =>
      expect(() => gameboard.getCell(sampleCoords)).toThrow(
        "The cell is out-of-bound"
      )
    );
  });

  it("has a fleet property that can be used to retrieve current ships", () => {
    expect(gameboard.fleet).toEqual([]);
  });

  it("can add a ship to the fleet", () => {
    gameboard.addShip(shipName1, shipLen1);
    expect(gameboard.fleet).toEqual([shipName1]);
  });

  it("throws and error if you try to add the same ship to the fleet", () => {
    expect(() => gameboard.addShip(shipName1, shipLen1)).toThrow(
      "The ship is already in the fleet"
    );
  });

  it("can check if a ship is already in the fleet", () => {
    expect(gameboard.hasShip(shipName1)).toBeTruthy();
    expect(gameboard.hasShip(shipName2)).toBeFalsy();
  });

  it("can check if a ship can be placed / is fully contained in the board", () => {
    sampleShipCoordsArrIn.forEach((sampleCoords) =>
      expect(gameboard.canPlaceShip(shipName1, ...sampleCoords)).toBeTruthy()
    );
    sampleShipCoordsArrOut.forEach((sampleCoords) =>
      expect(gameboard.canPlaceShip(shipName1, ...sampleCoords)).toBeFalsy()
    );
  });

  it("can place a Ship in the board", () => {
    const sampleCoordsIn = sampleShipCoordsArrIn[0];
    const sampleShipCells = [
      [1, 3],
      [1, 2],
      [1, 1],
      [1, 0],
    ];

    gameboard.placeShip(shipName1, ...sampleCoordsIn);

    // Check the cells: only the ones occupied by the ship should be occupied by a ship
    for (let c = 0; c < nCols; c++) {
      for (let r = 0; r < nRows; r++) {
        const cell = gameboard.getCell([c, r]);
        const isShipCell = sampleShipCells.some(
          ([cWithShip, rWithShip]) => cWithShip === c && rWithShip === r
        );

        if (isShipCell) {
          expect(cell.hasShip()).toBeTruthy();
        } else {
          expect(cell.hasShip()).toBeFalsy();
        }
      }
    }
  });

  it("can check if a Ship can be placed / is not overlapped with other ships", () => {
    gameboard.addShip(shipName2, shipLen2);
    const sampleCoordsIn = sampleShipCoordsArrIn[1];
    expect(gameboard.canPlaceShip(shipName2, ...sampleCoordsIn)).toBeFalsy();
  });

  it("Throws an error if you place a ship in a forbidden place", () => {
    const sampleCoordsIn = sampleShipCoordsArrIn[1];
    expect(() => gameboard.placeShip(shipName2, ...sampleCoordsIn)).toThrow(
      "The ship cannot be placed in this position"
    );
  });

  it("Can retrieve the deployed and not deployed fleet ships", () => {
    expect(gameboard.deployedFleet).toEqual([shipName1]);
    expect(gameboard.notDeployedFleet).toEqual([shipName2]);
  });
});
