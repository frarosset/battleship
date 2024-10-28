import PlaceableObjectDom from "./PlaceableObjectDom.js";
import { initDiv } from "../../js-utilities/commonDomComponents";
import { ships } from "../images.js";

export default class ShipDom extends PlaceableObjectDom {
  static blockName = "ship";
  static zIndex = 1;
  #maskDiv;

  constructor(name, cellsCoords, direction) {
    super(cellsCoords);

    // Precompute mask (to be used when the ship will sunk, to add an overlay)
    this.#maskDiv = initDiv(`${this.constructor.blockName}__mask`);
    this.#maskDiv.style.display = "none";
    this.div.append(this.#maskDiv);

    this.#applyStyle(name, direction);
  }

  makeItSunk() {
    this.div.classList.add("sunk");
    this.#maskDiv.style.display = "block";
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

      // Precompute mask style (to be used when the ship will sunk, to add an overlay)
      this.#maskDiv.style.maskImage = `url("${image}")`;
      this.#maskDiv.style.maskRepeat = "no-repeat";
      this.#maskDiv.style.maskSize = "100%";
      this.#maskDiv.style.width = "100%";
      this.#maskDiv.style.height = "100%";
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
