export const pubSubTokens = {
  initGameView: "INIT GAME VIEW",
  gameViewInitialized: "GAME VIEW INITIALIZED",
  playTurn: "PLAY TURN",
  attackCoordsAcquired: "ATTACK COORDS ACQUIRED",
};

export const pubSubTopicUi = "ui";
export const pubSubTokensUi = {
  enableAimingOnGameboard: (player) =>
    `ui: ENABLE AIMING ON ${player.name} GAMEBOARD`,
};
