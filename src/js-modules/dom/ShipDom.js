import PlaceableObjectDom from "./PlaceableObjectDom.js";
import { ships } from "../images.js";

export default class ShipDom extends PlaceableObjectDom {
  static blockName = "ship";
  static zIndex = 1;

  constructor(name, cellsCoords, direction) {
    super(cellsCoords);

    this.#applyStyle(name, direction);
  }

  makeItSunk() {
    this.div.classList.add("sunk");
  }

  #applyStyle(name, direction) {
    const imgDirection = direction == "N" || direction == "S" ? "S" : "E";

    const image = ships[name] ? ships[name][imgDirection] : null;

    if (image) {
      this.div.style.backgroundImage = `url("${image}")`;
      this.div.style.backgroundRepeat = "no-repeat";
      this.div.style.backgroundSize = "100% 100%";
      if (direction == "N" || direction == "W") {
        this.div.style.transform = "rotate(180deg)";
      }
    } else {
      // some fallback style
      this.div.style.background = "rgb(186,168,150)";
      this.div.style.background =
        "radial-gradient(closest-side, rgb(186,168,150) 0%, rgb(136,117,97) 50%, rgb(52,43,41) 100%)";

      const [r, R] = ["20px", "60%"];
      let borderRadius;
      switch (direction) {
        case "S":
          borderRadius = `${r} ${r} ${R} ${R}`;
          break;
        case "N":
          borderRadius = `${R} ${R} ${r} ${r}`;
          break;
        case "E":
          borderRadius = `${r} ${R} ${R} ${r}`;
          break;
        case "W":
          borderRadius = `${R} ${r} ${r} ${R}`;
          break;
        default:
          borderRadius = r;
      }
      this.div.style.borderRadius = borderRadius;
    }
  }
}
