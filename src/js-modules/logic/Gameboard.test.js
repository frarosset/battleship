import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";

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

  const shipName3 = "My third ship";
  const shipLen3 = 4;

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

  const shipCoords1 = sampleShipCoordsArrIn[0];
  const shipCellsCoords1 = [
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0],
  ];

  const shipCoords2 = [[3, 1], "S"];
  const shipCoords3 = [[4, 7], "W"];
  const shipCellsCoords3_W = [
    [4, 7],
    [3, 7],
    [2, 7],
    [1, 7],
  ];
  const shipCellsCoords3_N = [
    [4, 7],
    [4, 6],
    [4, 5],
    [4, 4],
  ];
  const ship3_CenterOfRotation = [2, 7];
  const shipCellsCoords3_cr_W = [
    [4, 7],
    [3, 7],
    [2, 7],
    [1, 7],
  ];
  const shipCellsCoords3_cr_N = [
    [2, 9],
    [2, 8],
    [2, 7],
    [2, 6],
  ];
  const shipCellsCoords3_cr_E = [
    [0, 7],
    [1, 7],
    [2, 7],
    [3, 7],
  ];
  const shipCellsCoords3_cr_S = [
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
  ];

  const shipMoveToCell3 = [3, 4];
  const shipMoveToCell3_invalid = [1, 8];
  const shipCellsCoords3_W_moved = [
    [3, 4],
    [2, 4],
    [1, 4],
    [0, 4],
  ];

  const shipMoveFromCell3_relative = [1, 4];
  const shipMoveToCell3_relative = [2, 6];
  const shipCellsCoords3_W_moved_relative = [
    [4, 6],
    [3, 6],
    [2, 6],
    [1, 6],
  ];

  it("is defined", () => {
    expect(Gameboard).toBeDefined();
  });

  describe("board handling", () => {
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
  });

  describe("fleet handling", () => {
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
      gameboard.placeShip(shipName1, ...shipCoords1);

      // Check the cells: only the ones occupied by the ship should be occupied by a ship
      for (let c = 0; c < nCols; c++) {
        for (let r = 0; r < nRows; r++) {
          const cell = gameboard.getCell([c, r]);
          const isShipCell = shipCellsCoords1.some(
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

    it("throws an error if you place a ship in a forbidden place", () => {
      const sampleCoordsIn = sampleShipCoordsArrIn[1];
      expect(() => gameboard.placeShip(shipName2, ...sampleCoordsIn)).toThrow(
        "The ship cannot be placed in this position"
      );
    });

    it("can retrieve the deployed and not deployed fleet ships", () => {
      expect(gameboard.deployedFleet).toEqual([shipName1]);
      expect(gameboard.notDeployedFleet).toEqual([shipName2]);
    });

    it("can retrieve the deployed/not deployed/sunk/fleet Ship objects", () => {
      expect(gameboard.deployedFleetAsShipObj).toEqual([
        new Ship(shipName1, shipLen1),
      ]);
      expect(gameboard.notDeployedFleetAsShipObj).toEqual([
        new Ship(shipName2, shipLen2),
      ]);
      expect(gameboard.sunkFleetAsShipObj).toEqual([]);
      expect(gameboard.fleetAsShipObj).toEqual([
        new Ship(shipName2, shipLen2),
        new Ship(shipName2, shipLen2),
      ]);
    });

    it("can check if a ship is already in the deployed fleet", () => {
      expect(gameboard.hasDeployedShip(shipName1)).toBeTruthy();
      expect(gameboard.hasDeployedShip(shipName2)).toBeFalsy();
    });

    it("can check if a ship is already in the not deployed fleet", () => {
      expect(gameboard.hasNotDeployedShip(shipName1)).toBeFalsy();
      expect(gameboard.hasNotDeployedShip(shipName2)).toBeTruthy();
    });

    it("cannot place a ship if this is not in the not deployed fleet", () => {
      const sampleShipCoords = [[3, 7], "N"];
      expect(
        gameboard.canPlaceShip(shipName1, ...sampleShipCoords)
      ).toBeFalsy();
    });

    it("can return the coordinates of the deployed or sunk fleet, and null for the not deployed one", () => {
      expect(gameboard.getShipPosition(shipName1)).toEqual([
        shipCellsCoords1,
        shipCoords1[1],
      ]);
      gameboard.addShip(shipName3, shipLen3); // not deployed ship
      expect(gameboard.getShipPosition(shipName3)).toEqual(null);
    });

    it("throws an error if you try to get the coordinates of a ship not in the fleet", () => {
      expect(() => gameboard.getShipPosition("not deployed ship")).toThrow(
        "The ship is not in the fleet"
      );
    });
  });

  describe("attack handling", () => {
    it("can receive an attack in a cell of the board", () => {
      const sampleCoordsHit = shipCoords1[0];
      const sampleCoordsMiss = [0, 0];

      expect(gameboard.getCell(sampleCoordsHit).hasBeenAttacked()).toBeFalsy();
      expect(gameboard.getCell(sampleCoordsMiss).hasBeenAttacked()).toBeFalsy();

      gameboard.receiveAttack(sampleCoordsHit);
      gameboard.receiveAttack(sampleCoordsMiss);

      expect(gameboard.getCell(sampleCoordsHit).hasBeenAttacked()).toBeTruthy();
      expect(
        gameboard.getCell(sampleCoordsMiss).hasBeenAttacked()
      ).toBeTruthy();
    });

    it("throws an error if you try to attack an out-of-bound cell", () => {
      const sampleCoordsOut = [-1, 0];

      expect(() => gameboard.receiveAttack(sampleCoordsOut)).toThrow(
        "The cell is out-of-bound"
      );
    });

    const sampleCoordsMiss2 = [0, 3];
    const sampleCoordsHit2 = [1, 2];

    it("returns truthy if the attack is a hit, increasing the ship hits, and falsy otherwise", () => {
      expect(gameboard.receiveAttack(sampleCoordsMiss2)).toBeFalsy();
      expect(gameboard.receiveAttack(sampleCoordsHit2)).toBeTruthy();
      // the considered ship has received two attacks, one in [1,4] and [1,3]
      expect(gameboard.getCell(sampleCoordsHit2).getShip().hits).toBe(2);
    });

    it("throws an error an attack is repeated in the same cell", () => {
      expect(() => gameboard.receiveAttack(sampleCoordsHit2)).toThrow(
        "This cell has already been attacked"
      );
    });

    it("can retrieve the sunk fleet ships", () => {
      expect(gameboard.sunkFleet).toEqual([]);
      // add attaks to sunk the ship 1 (two attacks have already been done in the previous tests)
      gameboard.receiveAttack([1, 1]);
      gameboard.receiveAttack([1, 0]);
      expect(gameboard.sunkFleet).toEqual([shipName1]);
    });

    it("can check if a ship is sunk", () => {
      expect(gameboard.hasSunkShip(shipName1)).toBeTruthy();
      expect(gameboard.hasSunkShip(shipName2)).toBeFalsy();
    });

    it("remove a ship from the deployed fleet when it sinks", () => {
      expect(gameboard.hasDeployedShip(shipName1)).toBeFalsy();
      // the following must still be truth though
      expect(gameboard.hasShip(shipName1)).toBeTruthy();
      // use sets: items can be roerdered here
      expect(new Set(gameboard.fleet)).toEqual(
        new Set([shipName1, shipName2, shipName3])
      );
    });

    it("check if there are deployed ships", () => {
      // ship 2 is not deployed, ship 1 is sunk
      expect(gameboard.hasDeployedShips()).toBeFalsy();
    });

    it("check if there are not deployed ships", () => {
      // ship 2 is not deployed, ship 1 is sunk
      expect(gameboard.hasNotDeployedShips()).toBeTruthy();
    });

    it("can return the cell matrix (array of arrays)", () => {
      expect(gameboard.cells.length).toBe(nCols);
      expect(gameboard.cells[0].length).toBe(nRows);
    });

    it("return an outcome code when receiving an attack", () => {
      gameboard.placeShip(shipName2, ...shipCoords2);
      // attacking these cells (not attacked yet) produces, respectively, a miss, a hit, and a hit and miss
      expect(gameboard.receiveAttack([3, 0])).toEqual(0);
      expect(gameboard.receiveAttack([3, 1])).toEqual(1);
      expect(gameboard.receiveAttack([3, 2])).toEqual(2);
    });
  });

  describe("deployed fleet editing", () => {
    it("can reset a deployed ship into in the not deployed fleet", () => {
      gameboard.placeShip(shipName3, ...shipCoords3);
      gameboard.resetShip(shipName3);

      // the ship is moved into the not deployed fleet
      expect(gameboard.hasDeployedShip(shipName3)).toBeFalsy();
      expect(gameboard.hasNotDeployedShip(shipName3)).toBeTruthy();

      // the ship position is null
      expect(gameboard.getShipPosition(shipName3)).toBeNull();

      // Check the cells: none of them is occupied by the ship
      for (let c = 0; c < nCols; c++) {
        for (let r = 0; r < nRows; r++) {
          const cell = gameboard.getCell([c, r]);

          if (cell.hasShip()) {
            expect(cell.getShip().name).not.toBe(shipName3);
          }
        }
      }
    });

    it("can rotate a deployed ship", () => {
      gameboard.placeShip(shipName3, ...shipCoords3);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W,
        "W",
      ]);

      gameboard.rotateShip(shipName3);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_N,
        "N",
      ]);

      gameboard.rotateShip(shipName3);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W,
        "W",
      ]);
    });

    it("can rotate a deployed ship around a center of rotation", () => {
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_cr_W,
        "W",
      ]);

      gameboard.rotateShip(shipName3, ship3_CenterOfRotation);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_cr_N,
        "N",
      ]);

      gameboard.rotateShip(shipName3, ship3_CenterOfRotation);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_cr_E,
        "E",
      ]);

      gameboard.rotateShip(shipName3, ship3_CenterOfRotation);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_cr_S,
        "S",
      ]);

      gameboard.rotateShip(shipName3, ship3_CenterOfRotation);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_cr_W,
        "W",
      ]);
    });

    it("can move a deployed ship to a different position", () => {
      // start from the previous position
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W,
        "W",
      ]);

      // it is assumed the new stern cell is specified
      gameboard.startMoveShip(shipName3);
      gameboard.endMoveShip(shipName3, shipMoveToCell3);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);
    });

    it("restores the original position when moving a deployed ship to an invalid position", () => {
      // start from the previous position
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);

      // it is assumed the new stern cell is specified
      gameboard.startMoveShip(shipName3);
      gameboard.endMoveShip(shipName3, shipMoveToCell3_invalid);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);
    });

    it("restores the original position when no new position is specified", () => {
      // start from the previous position
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);

      // it is assumed the new stern cell is specified
      gameboard.startMoveShip(shipName3);
      gameboard.endMoveShip(shipName3);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);
    });

    it("can move a deployed ship to a different position relative to a non-stern ship coordinate", () => {
      // start from the previous position
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved,
        "W",
      ]);

      // if a coordinate is specified in the startMoveShip method, it defines an offset wrt the stern cell
      // then, the coordinates specifiend in the endMoveShip method are assumed to have the same offset from the new stern cell
      gameboard.startMoveShip(shipName3, shipMoveFromCell3_relative);
      gameboard.endMoveShip(shipName3, shipMoveToCell3_relative);

      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved_relative,
        "W",
      ]);
    });

    it("returns true if the deployed ship is actually moved to a different position, and false otherwise", () => {
      // start from the previous position
      expect(gameboard.getShipPosition(shipName3)).toEqual([
        shipCellsCoords3_W_moved_relative,
        "W",
      ]);

      gameboard.startMoveShip(shipName3);
      const successMove = gameboard.endMoveShip(shipName3, [4, 8]);
      expect(successMove).toBeTruthy();

      gameboard.startMoveShip(shipName3);
      const failMove = gameboard.endMoveShip(shipName3, [2, 2]);
      expect(failMove).toBeFalsy();
    });

    it("returns true if the ship being moved could be placed in a given position, and false otherwise", () => {
      // its just a test: the ship is not actually placed
      gameboard.startMoveShip(shipName3);

      // can be moved in the initial cell
      const canBeMovedToOrig = gameboard.canPlaceShipOnMove(shipName3, [4, 8]);
      expect(canBeMovedToOrig).toBeTruthy();
      expect(gameboard.hasNotDeployedShip(shipName3)).toBeTruthy();

      const canBeMoved = gameboard.canPlaceShipOnMove(shipName3, [4, 7]);
      expect(canBeMoved).toBeTruthy();
      expect(gameboard.hasNotDeployedShip(shipName3)).toBeTruthy();

      const cannotBeMoved = gameboard.canPlaceShipOnMove(shipName3, [2, 2]);
      expect(cannotBeMoved).toBeFalsy();
      expect(gameboard.hasNotDeployedShip(shipName3)).toBeTruthy();

      // restore ship position
      gameboard.endMoveShip(shipName3);
    });
  });
});
