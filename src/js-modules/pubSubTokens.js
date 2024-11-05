export const pubSubTokens = {
  showGameView: "SHOW GAME VIEW",
  showGameEndView: "SHOW GAME END VIEW",
  showDeployFleetView: "SHOW DEPLOY FLEET VIEW",
  showHomeView: "SHOW HOME VIEW",
  showPlayersNameView: "SHOW PLAYERS NAME VIEW",
  gameViewInitialized: "GAME VIEW INITIALIZED",
  fleetDeployed: "FLEET DEPLOYED",
  playTurn: "PLAY TURN",
  attackCoordsAcquired: "ATTACK COORDS ACQUIRED",
  attackOutcomeShown: "ATTACK OUTCOME SHOWN",
};

export const pubSubTopicUi = "ui";
export const pubSubTokensUi = {
  setCurrentPlayer: (player) => `ui: SET ${player.name} AS CURRENT PLAYER`,
  enableAimingOnGameboard: (player) =>
    `ui: ENABLE AIMING ON ${player.name} GAMEBOARD`,
  showAttackOutcome: (player) => `ui: SHOW ATTACK ON ${player.name} GAMEBOARD`,
  shipHasSunk: (player) => `ui: ${player.name} SHIP HAS SUNK`,
  toggleDeployedFleetShown: (player) =>
    `ui: TOGGLE DEPLOYED FLEET ON ${player.name} GAMEBOARD`,
  hideDeployedFleetShown: (player) =>
    `ui: HIDE DEPLOYED FLEET ON ${player.name} GAMEBOARD`,
  playersSwitch: "PLAYERS SWITCH",
};
