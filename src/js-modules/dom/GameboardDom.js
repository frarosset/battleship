import { initDiv } from "../../js-utilities/commonDomComponents";
import CellDom from "./CellDom.js";
import { pubSubTokens } from "../pubSubTokens.js";
import PubSub from "pubsub-js";
import ShipDom from "./ShipDom.js";
import HitMarkDom from "./HitMarkDom.js";
import MissMarkDom from "./MissMarkDom.js";

const blockName = "gameboard";
const aimingClass = "aiming";

const animationInitialStateClass = "initial-state";
const animationDuration = 200; // ms

// set the animation duration css property
document.documentElement.style.setProperty(
  "--time-animation",
  `${animationDuration}ms`
);

export default class GameboardDom {
  #div;
  #gameboard;
  #cells;
  #getAttackCoordsOnClickCallbackBinded;
  #fleetDom;
  #deployedFleetShown;
  #deployedFleetAnimationOn;

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
    this.#deployedFleetAnimationOn = false;
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

  // the function is async, and awaits for the hit/miss mark show animation, if any
  async showAttackOutcome(coords, outcome) {
    const cellDom = this.#cells.get(coords.join(","));
    cellDom.setAttackedStatus();

    const outcomeMarkDom = outcome.isHit
      ? new HitMarkDom(coords)
      : new MissMarkDom(coords);
    this.#div.append(outcomeMarkDom.div);

    await triggerAnimation(outcomeMarkDom.div);

    if (outcome.isSunk) {
      const shipName = outcome.sunkShip.name;
      const shipObj = this.#fleetDom.get(shipName);
      shipObj.makeItSunk();
      await this.#showShip(shipObj);
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

  // the function is async, and awaits for the ship show animation, if any
  async #showShip(shipObj) {
    this.#div.append(shipObj.div);
    await triggerAnimation(shipObj.div);
  }

  // the function is async, and awaits for the ship hide animation, if any
  async #hideShip(shipObj) {
    await triggerAnimation(shipObj.div, true);
    // wait for the animation to end before removing it
    this.#div.removeChild(shipObj.div);
  }

  #initFleet() {
    this.#gameboard.fleet.forEach((shipName) => {
      const shipObj = this.#createShipDom(shipName);
      this.#fleetDom.set(shipName, shipObj);
    });
  }

  // the function is async, and awaits for all the ship show animations, if any
  async showDeployedFleet() {
    // do nothing if there is an animation ongoing or the fleet is already shown
    if (!this.#deployedFleetShown && !this.#deployedFleetAnimationOn) {
      this.#deployedFleetAnimationOn = true;

      // save promises returned by #showShip to eventually wait for they resolution
      const promiseArray = [];

      this.#gameboard.deployedFleet.forEach((shipName) => {
        const shipObj = this.#fleetDom.get(shipName);
        promiseArray.push(this.#showShip(shipObj)); // returns a promise
      });

      await Promise.all(promiseArray);

      this.#deployedFleetShown = true;
      this.#deployedFleetAnimationOn = false;
    }
  }

  // the function is async, and awaits for all the ship hide animations, if any
  async hideDeployedFleet() {
    // do nothing if there is an animation ongoing or the fleet is already hidden
    if (this.#deployedFleetShown && !this.#deployedFleetAnimationOn) {
      this.#deployedFleetAnimationOn = true;

      // save promises returned by #showShip to eventually wait for they resolution
      const promiseArray = [];

      this.#gameboard.deployedFleet.forEach((shipName) => {
        const shipObj = this.#fleetDom.get(shipName);
        promiseArray.push(this.#hideShip(shipObj)); // returns a promise
      });

      await Promise.all(promiseArray);

      this.#deployedFleetShown = false;
      this.#deployedFleetAnimationOn = false;
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

async function triggerAnimation(div, hide = false) {
  // this uses a trick to trigger the animation on the element

  hide
    ? div.classList.remove(animationInitialStateClass)
    : div.classList.add(animationInitialStateClass);

  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) =>
    setTimeout(() => {
      div.classList.toggle(animationInitialStateClass);
      resolve();
    }, 0)
  );

  // wait for the animation to end before removing it
  return new Promise((resolve) => setTimeout(resolve, animationDuration));
}
