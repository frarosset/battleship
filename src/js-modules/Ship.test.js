import Ship from "./Ship.js";

describe("Ship class", () => {
  const shipLength = 4;
  const ship = new Ship(shipLength);

  it("is defined", () => {
    expect(Ship).toBeDefined();
  });

  it("has a length", () => {
    expect(ship.length).toBe(shipLength);
  });
});
