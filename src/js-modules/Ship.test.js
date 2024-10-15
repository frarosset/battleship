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

  it("has a hits counter initialized to 0", () => {
    expect(ship.hits).toBe(0);
  });

  it("can increase the hit counter by 1", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });
});
