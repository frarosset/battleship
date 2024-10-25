import PlaceableObjectDom from "./PlaceableObjectDom.js";

export default class ShipDom extends PlaceableObjectDom {
  static blockName = "ship";
  static zIndex = 1;

  constructor(cellsCoords) {
    super(cellsCoords);

    this.#applyStyle();
  }

  #applyStyle() {
    // temporary style
    this.div.style.background = "brown";
    this.div.style.transform = "scale(0.9)";
  }
}
