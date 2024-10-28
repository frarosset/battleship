import PlaceableObjectDom from "./PlaceableObjectDom.js";

export default class HitMarkDom extends PlaceableObjectDom {
  static blockName = "hit-mark";
  static zIndex = 2;

  constructor(cellsCoords) {
    super([cellsCoords]);
  }
}
