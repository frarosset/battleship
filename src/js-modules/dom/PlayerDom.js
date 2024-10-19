import { initDiv, initH3 } from "../../js-utilities/commonDomComponents";

const blockName = "player";
const cssClass = {
  nameH3: "name-h3",
};
const getCssClass = (element) => `${blockName}__${cssClass[element]}`;

export default class PlayerDom {
  #div;
  #player;

  constructor(player) {
    this.#player = player;
    this.#div = initPlayerDiv(player);
    this.#div.obj = this;
  }

  // getters
  get div() {
    return this.#div;
  }
  get player() {
    return this.#player;
  }
}

// private methods
// if they use 'this', they have to be evoked as: methodName.call(this,args)

function initPlayerDiv(player) {
  const div = initDiv(blockName);
  const h3 = initNameDiv(player.name);

  div.append(h3);

  return div;
}

function initNameDiv(name) {
  const h3 = initH3(getCssClass("nameH3"));
  h3.textContent = name;
  return h3;
}
