import { initDiv } from "../../js-utilities/commonDomComponents";
import CellDom from "./CellDom.js";
import { pubSubTokens } from "../pubSubTokens.js";
import PubSub from "pubsub-js";
import ShipDom from "./ShipDom.js";

const blockName = "gameboard";
const cssClass = {};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

const aimingClass = "aiming";

export default class GameboardDom {
  #div;
  #gameboard;
  #cells;
  #getAttackCoordsOnClickCallbackBinded;
  #deployedFleetDom;
  #deployedFleetShown;

  constructor(gameboard) {
    this.#gameboard = gameboard;
    this.#cells = new Map();
    this.#div = this.#initGameboardDiv(gameboard);
    this.#div.obj = this;

    this.#getAttackCoordsOnClickCallbackBinded =
      this.#getAttackCoordsOnClickCallback.bind(this);

    this.#deployedFleetDom = new Map();
    this.#deployedFleetShown = false;

    // temporary code for testing
    this.showDeployedFleet();
    this.toggleDeployedFleet();
    this.toggleDeployedFleet();
  }

  // getters
  get div() {
    return this.#div;
  }

  get gameboard() {
    return this.#gameboard;
  }

  enableAiming() {
    this.#div.classList.add(aimingClass);
    this.#div.addEventListener(
      "click",
      this.#getAttackCoordsOnClickCallbackBinded
    );
  }

  showAttackOutcome(coords, outcome) {
    const cellDom = this.#cells.get(coords.join(","));
    cellDom.setAttackedStatus();
    PubSub.publish(pubSubTokens.attackOutcomeShown, { coords, outcome });
  }

  #getAttackCoordsOnClickCallback(e) {
    // we have subscribed to one event listener for the gameboard: we need to retrieve the appropriate cell
    const targetClassList = e.target.classList;
    if (![...targetClassList].includes("cell")) {
      const origDisplay = e.target.style.display;
      e.target.style.display = "none";
      document.elementFromPoint(e.clientX, e.clientY).click();
      e.target.style.display = origDisplay;
      return;
    }

    const cellDiv = e.target;
    const cell = cellDiv.obj.cell;

    if (!cell.hasBeenAttacked()) {
      // exit aiming mode
      this.#div.classList.remove(aimingClass);
      this.#div.removeEventListener(
        "click",
        this.#getAttackCoordsOnClickCallbackBinded
      );

      PubSub.publish(pubSubTokens.attackCoordsAcquired, cell.coords);
    }
  }

  #initGameboardDiv(gameboard) {
    const div = initDiv(blockName);

    // Force grid appearance
    div.style.display = "grid";
    div.style.aspectRatio = `${gameboard.nCols}/${gameboard.nRows}`;
    div.style.gridTemplateColumns = `repeat(${gameboard.nCols},minmax(0,1fr))`;
    div.style.gridTemplateRows = `repeat(${gameboard.nRows},minmax(0,1fr))`;

    const cells = gameboard.cells;
    cells.forEach((column) => {
      column.forEach((cell) => {
        const cellDom = new CellDom(cell);
        this.#cells.set(cell.coords.join(","), cellDom);
        div.append(cellDom.div);
      });
    });
    return div;
  }

  #createShipDom(shipName) {
    const shipObj = new ShipDom(
      shipName,
      ...this.#gameboard.getShipPosition(shipName)
    );
    return shipObj;
  }

  #showShip(shipObj) {
    this.#div.append(shipObj.div);
  }

  #hideShip(shipObj) {
    this.#div.removeChild(shipObj.div);
  }

  showDeployedFleet() {
    this.#gameboard.deployedFleet.forEach((shipName) => {
      let shipObj;
      if (!this.#deployedFleetDom.has(shipName)) {
        shipObj = this.#createShipDom(shipName);
        this.#deployedFleetDom.set(shipName, shipObj);
      } else {
        shipObj = this.#deployedFleetDom.get(shipName);
      }
      this.#showShip(shipObj);
    });
    this.#deployedFleetShown = true;
  }

  hideDeployedFleet() {
    this.#deployedFleetDom.forEach((shipObj) => {
      this.#hideShip(shipObj);
    });
    this.#deployedFleetShown = false;
  }

  toggleDeployedFleet() {
    if (this.#deployedFleetShown) {
      this.hideDeployedFleet();
    } else {
      this.showDeployedFleet();
    }
  }
}
