import { initDiv } from "../../js-utilities/commonDomComponents";
import { getNestedElementOfClass } from "../../js-utilities/commonDomUtilities.js";
import CellDom from "./CellDom.js";
import { pubSubTokens } from "../pubSubTokens.js";
import PubSub from "pubsub-js";
import ShipDom from "./ShipDom.js";
import HitMarkDom from "./HitMarkDom.js";
import MissMarkDom from "./MissMarkDom.js";

const blockName = "gameboard";
const aimingClass = "aiming";

const animationInitialStateClass = "initial-state";
const noTransitionClass = "no-transition";
const onDragClass = "on-drag";
const animationDuration = 200; // ms
const waitDelay = 60;

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
  #startEditingPointerDownCallbackBinded;
  #fleetDom;
  #deployedFleetShown;
  #deployedFleetAnimationOn;

  constructor(gameboard, canBeModified = false) {
    this.#gameboard = gameboard;
    this.#cells = new Map();
    this.#div = this.#initGameboardDiv(gameboard);
    this.#div.obj = this;

    this.#getAttackCoordsOnClickCallbackBinded =
      this.#getAttackCoordsOnClickCallback.bind(this);

    this.#startEditingPointerDownCallbackBinded =
      this.#startEditingPointerDownCallback.bind(this);

    this.#fleetDom = new Map();
    this.#initFleet();
    this.#deployedFleetShown = false;
    this.#deployedFleetAnimationOn = false;

    if (canBeModified) {
      this.#setEditCallbacks();
    }
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
    const point = [e.clientX, e.clientY];
    const cellDiv = getNestedElementOfClass(point, "cell");

    if (cellDiv == null) {
      return;
    }

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

  async updateDeployedShip(shipName) {
    const shipObj = this.#fleetDom.get(shipName);

    await this.#hideShip(shipObj);

    // change position of shipDom objects
    shipObj.updatePosition(...this.#gameboard.getShipPosition(shipName));

    await this.#showShip(shipObj);
  }

  async updateDeployedFleet() {
    await this.hideDeployedFleet();

    // change position of shipDom objects
    this.#gameboard.fleet.forEach((shipName) => {
      const shipObj = this.#fleetDom.get(shipName);
      shipObj.updatePosition(...this.#gameboard.getShipPosition(shipName));
    });

    await this.showDeployedFleet();
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

  // set callback when edit is possible

  #setEditCallbacks() {
    // Disable touch-action property on each ship div to enable dragging on touch devices
    // see https://stackoverflow.com/questions/48124372/pointermove-event-not-working-with-touch-why-not
    this.#disableTouchActionOnFleet();

    // Disable dragStart events handling on each ship div
    // see https://javascript.info/mouse-drag-and-drop
    this.#disableDragStartOnFleet();

    // Set event listeners just to the gameboard div and use event delegation: you can still retrieve the correct ship / cell

    this.#div.addEventListener(
      "pointerdown",
      this.#startEditingPointerDownCallbackBinded
    );
  }

  #disableTouchActionOnFleet() {
    this.#gameboard.deployedFleet.forEach((shipName) => {
      const shipObj = this.#fleetDom.get(shipName);
      shipObj.div.style.touchAction = "none";
    });
  }

  #disableDragStartOnFleet() {
    this.#gameboard.deployedFleet.forEach((shipName) => {
      const shipObj = this.#fleetDom.get(shipName);
      shipObj.div.ondragstart = () => false;
    });
  }

  #startEditingPointerDownCallback(e) {
    // a single handler for both rotate and drag: the operation to perform is decided using
    // a displacement threshold: within a given displacement, it is still considered a click
    // see: https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
    //
    // dragging based on: https://javascript.info/mouse-drag-and-drop
    // instead of absolutely positioning the dragging element, a transform translate() will be used

    e.preventDefault();

    // we have subscribed to one event listener for the gameboard: we need to retrieve the appropriate cell div
    const point = [e.clientX, e.clientY];
    const shipDiv = getNestedElementOfClass(point, "ship");

    // if there is no ship, return
    if (shipDiv == null) {
      return;
    }

    this.#div.removeEventListener(
      "pointerdown",
      this.#startEditingPointerDownCallbackBinded
    );

    // if there is a ship div, there is necessarily a cell div, too, and the corresponding cell has a ship
    const cellDiv = getNestedElementOfClass(point, "cell");
    const cell = cellDiv.obj.cell;
    const shipName = cell.getShip().name;

    // Save the current transform property of the shipDiv: it will be modified while dragging
    const origShipDivTransform = shipDiv.style.transform;

    // get current coordinates of pointer with respect to window (ie, use clientX, clientY)
    const origX = e.clientX;
    const origY = e.clientY;

    // variables used to distinguish between a simple click and a drag
    const maxDeltaForClick = 6; // pixels
    let dragOn = false;

    // Define the onDrag and endDrag callbacks in here (use the variables defined on the startDrag callbacks)

    function onPointerMoveCallback(e) {
      const deltaX = e.clientX - origX;
      const deltaY = e.clientY - origY;

      if (!dragOn) {
        const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        if (maxDelta <= maxDeltaForClick) {
          // too small displacement: consider it a click
          return;
        }

        dragOn = true;

        // initialize the move of the ship
        this.#gameboard.startMoveShip(shipName, cell.coords);
        shipDiv.classList.add(onDragClass);
      }

      // you are actually dragging
      // translate the ship to the current pointer coordinates updating the transform property of the shipDiv
      // remember to include the original transform value
      shipDiv.style.transform = `translate(${deltaX}px,${deltaY}px) ${origShipDivTransform}`;
    }

    async function stopEditingPointerUpCallback(e) {
      document.removeEventListener("pointermove", onPointerMoveCallbackBinded);
      document.removeEventListener(
        "pointerup",
        stopEditingPointerUpCallbackBinded
      );

      if (dragOn) {
        // get the cell in which you have stopped, if it exists
        // otherwise, return to the original cell
        const point = [e.clientX, e.clientY];
        const stopCellDiv = getNestedElementOfClass(point, "cell");
        const toCell = stopCellDiv ? stopCellDiv.obj.cell : cell;

        // finalize the move of the ship
        const hasMoved = this.#gameboard.endMoveShip(shipName, toCell.coords);

        // compute the translation of the ship when placed on the toCell
        // note that so far the ship position was free, now it is forced to stay in the grid cells

        // also, to allow for a smooth transition, first translate the ship in the original position

        const cellRect = cellDiv.getBoundingClientRect();
        const toCellRect = hasMoved
          ? stopCellDiv.getBoundingClientRect()
          : cellRect;

        const deltaX = toCellRect.x - cellRect.x;
        const deltaY = toCellRect.y - cellRect.y;

        shipDiv.style.transform = `translate(${deltaX}px,${deltaY}px) ${origShipDivTransform}`;

        // wait for the translation animation to end
        await waitForAsync(animationDuration);

        // set the .no-transition class on this ship: we want the next few operations to occur instantaneously
        shipDiv.classList.add(noTransitionClass);
        await ensureCssClassForAnimationAsync();

        // so far, just transforms were used on the ship div: update now the actual position
        const shipObj = this.#fleetDom.get(shipName);
        shipObj.updatePosition(...this.#gameboard.getShipPosition(shipName));

        // restore the original transform property
        shipDiv.style.transform = origShipDivTransform;

        // wait for a few ms to ensure the previous operations were performed, and then remove the no transition class
        await waitForAsync(waitDelay);
        shipDiv.classList.remove(noTransitionClass);
        shipDiv.classList.remove(onDragClass);
      } else {
        // rotate ship
        this.#gameboard.rotateShip(shipName, cell.coords);

        await this.updateDeployedShip(shipName);
      }

      this.#div.addEventListener(
        "pointerdown",
        this.#startEditingPointerDownCallbackBinded
      );
    }

    const onPointerMoveCallbackBinded = onPointerMoveCallback.bind(this);
    const stopEditingPointerUpCallbackBinded =
      stopEditingPointerUpCallback.bind(this);

    document.addEventListener("pointermove", onPointerMoveCallbackBinded);
    document.addEventListener("pointerup", stopEditingPointerUpCallbackBinded);
  }
}

function waitForAsync(waitInMs) {
  return new Promise((resolve) => setTimeout(resolve, waitInMs));
}

async function ensureCssClassForAnimationAsync() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await waitForAsync(0);
}

async function triggerAnimation(div, hide = false) {
  // this uses a trick to trigger the animation on the element

  hide
    ? div.classList.remove(animationInitialStateClass)
    : div.classList.add(animationInitialStateClass);

  await ensureCssClassForAnimationAsync();

  div.classList.toggle(animationInitialStateClass);

  // wait for the animation to end before removing it
  return waitForAsync(animationDuration);
}
