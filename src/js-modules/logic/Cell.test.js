import Cell from "./Cell.js";

describe("Cell class", () => {
  const coords = [4, 6];
  const cell = new Cell(coords);

  it("is defined", () => {
    expect(Cell).toBeDefined();
  });

  it("has some coordinates", () => {
    expect(cell.coords).toBe(coords);
    expect(cell.x).toBe(coords[0]);
    expect(cell.y).toBe(coords[1]);
  });
});
