import { initDiv } from "../../js-utilities/commonDomComponents";
import CellDom from "./CellDom.js";
import { pubSubTokens } from "../pubSubTokens.js";
import PubSub from "pubsub-js";
import ShipDom from "./ShipDom.js";

const blockName = "gameboard";

const aimingClass = "aiming";

export default class GameboardDom {
  #div;
  #gameboard;
  #cells;
  #getAttackCoordsOnClickCallbackBinded;
  #fleetDom;
  #deployedFleetShown;

  constructor(gameboard) {
    this.#gameboard = gameboard;
    this.#cells = new Map();
    this.#div = this.#initGameboardDiv(gameboard);
    this.#div.obj = this;

    this.#getAttackCoordsOnClickCallbackBinded =
      this.#getAttackCoordsOnClickCallback.bind(this);

    this.#fleetDom = new Map();
    this.#initFleet();
    this.#deployedFleetShown = false;
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
    if (outcome.isSunk) {
      const shipName = outcome.sunkShip.name;
      const shipObj = this.#fleetDom.get(shipName);
      shipObj.makeItSunk();
      this.#showShip(shipObj);
    }
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

  #initFleet() {
    this.#gameboard.fleet.forEach((shipName) => {
      const shipObj = this.#createShipDom(shipName);
      this.#fleetDom.set(shipName, shipObj);
    });
  }

  showDeployedFleet() {
    this.#gameboard.deployedFleet.forEach((shipName) => {
      const shipObj = this.#fleetDom.get(shipName);
      this.#showShip(shipObj);
    });
    this.#deployedFleetShown = true;
  }

  hideDeployedFleet() {
    if (this.#deployedFleetShown) {
      this.#gameboard.deployedFleet.forEach((shipName) => {
        const shipObj = this.#fleetDom.get(shipName);
        this.#hideShip(shipObj);
      });
      this.#deployedFleetShown = false;
    }
  }

  toggleDeployedFleet() {
    if (this.#deployedFleetShown) {
      this.hideDeployedFleet();
    } else {
      this.showDeployedFleet();
    }
  }
}
