import Cell from "./Cell.js";
import Ship from "./Ship.js";

describe("Cell class", () => {
  const coords = [4, 6];
  const cell = new Cell(coords);
  const ship = new Ship(4);

  it("is defined", () => {
    expect(Cell).toBeDefined();
  });

  it("has some coordinates", () => {
    expect(cell.coords).toEqual(coords);
    expect(cell.x).toBe(coords[0]);
    expect(cell.y).toBe(coords[1]);
  });

  it("can be occupied by a ship", () => {
    expect(cell.hasShip()).toBeFalsy();
    expect(cell.getShip()).toBe(null);
    cell.placeShip(ship);
    expect(cell.hasShip()).toBeTruthy();
    expect(cell.getShip()).toStrictEqual(ship);
  });

  it("can be attacked", () => {
    expect(cell.hasBeenAttacked()).toBeFalsy();
    cell.receiveAttack();
    expect(cell.hasBeenAttacked()).toBeTruthy();
  });

  const cellMiss = new Cell(coords);
  const cellHit = new Cell(coords);
  const shipHit = new Ship(4);
  cellHit.placeShip(shipHit);

  it("return true if the attack is a hit", () => {
    expect(cellMiss.receiveAttack()).toBeFalsy();
    expect(cellHit.receiveAttack()).toBeTruthy();
  });

  it("increases the hits of the ship in there when it recives a hit attack", () => {
    expect(cellHit.getShip().hits).toBe(1);
  });

  it("throws an error an attack is repeated in the same cell", () => {
    expect(() => cellHit.receiveAttack()).toThrow(
      "This cell has already been attacked"
    );
  });
});
