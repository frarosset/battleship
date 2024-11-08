import {
  initDiv,
  initP,
  initButton,
  initHeader,
} from "../../js-utilities/commonDomComponents.js";
import PlayerDom from "./PlayerDom.js";
import { pubSubTokens, pubSubTokensUi } from "../pubSubTokens.js";
import PubSub from "pubsub-js";
import { getEditInstructionsMessage } from "../messages.js";

const blockName = "deploy-fleet";
const cssClass = {
  header: "header",
  playerDiv: "player-div",
  btns: "btns",
  msgP: "msg-p",
  editInstructionsP: "edit-instructions-p",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

const deployFleetAiDelay = 1000; // ms

export default class DeployFleetViewDom {
  #div;
  #playerDom;

  constructor(player, isAi) {
    player.randomShipsPlacement();

    if (isAi) {
      this.#div = this.#initAiDeployFleetViewDiv();

      // Notify the initialization of the fleet for the AI
      setTimeout(
        () => PubSub.publish(pubSubTokens.fleetDeployed),
        deployFleetAiDelay
      );
    } else {
      // allow the user to deploy its fleet, showing an editable gameboard
      this.#playerDom = new PlayerDom(player, true);

      this.#div = this.#initDeployFleetViewDiv();
    }
  }

  // getters
  get div() {
    return this.#div;
  }

  #initAiDeployFleetViewDiv() {
    const div = initDiv(blockName);

    const msgP = this.#initGameMsg();

    div.append(msgP);

    return div;
  }

  #initDeployFleetViewDiv() {
    const div = initDiv(blockName);

    const header = this.#initHeader();

    const playerDiv = initDiv(getCssClass("playerDiv"));

    this.#playerDom.div.append(this.#initEditInstructions());
    playerDiv.append(this.#playerDom.div);

    // show the ships
    PubSub.publish(
      pubSubTokensUi.toggleDeployedFleetShown(this.#playerDom.player)
    );

    const msgP = this.#initGameMsg();

    div.append(header, playerDiv, msgP);

    return div;
  }

  #initHeader() {
    const header = initHeader(getCssClass("header"));

    const buttonsDiv = initDiv(getCssClass("btns"));
    const showFleetBtn = this.#initRandomizeFleetButton();
    const fleetReadyBtn = this.#initFleetReadyButton();

    buttonsDiv.append(showFleetBtn, fleetReadyBtn);
    header.append(buttonsDiv);

    return header;
  }

  #initEditInstructions() {
    const msg = getEditInstructionsMessage();
    return initP(getCssClass("editInstructionsP"), null, msg);
  }

  #initGameMsg() {
    // for now show a temporary msg, to setup the page...the actual message selection is todo
    const msg = "A message to show game status (TODO)";
    return initP(getCssClass("msgP"), null, msg);
  }

  #randomizeFleetCallback() {
    this.#playerDom.player.repeatRandomShipsPlacement();

    PubSub.publish(
      pubSubTokensUi.updateDeployedFleetShown(this.#playerDom.player)
    );
  }

  #initRandomizeFleetButton() {
    const btn = initButton(
      "btn",
      this.#randomizeFleetCallback.bind(this),
      null,
      "Randomize"
    );

    return btn;
  }

  #fleetReadyCallback() {
    // Notify the initialization of the page
    PubSub.publish(pubSubTokens.fleetDeployed);
  }

  #initFleetReadyButton() {
    const btn = initButton("btn", this.#fleetReadyCallback, null, "I'M READY!");

    return btn;
  }
}
