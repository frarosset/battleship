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
    expect(cell.coords).toBe(coords);
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
});
