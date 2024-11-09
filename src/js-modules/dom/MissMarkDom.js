import PlaceableObjectDom from "./PlaceableObjectDom.js";

export default class HitMarkDom extends PlaceableObjectDom {
  static blockName = "miss-mark";
  static zIndex = 3;

  constructor(cellsCoords) {
    super([cellsCoords]);
  }
}
