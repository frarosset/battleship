const home = [
  "BATTLESHIP",
  "Fair winds and following seas! Until next battle...",
];

const editInstructions =
  "Click/tap on a ship to rotate it. Drag and drop to move it.";

const deployFleet = {
  player1_1p: [
    "Prepare for the battle, Captain! It's time to arrange your fleet.",
  ],
  player2_1p: [
    "The enemy is now deploying the fleet. Stay alert: the battle is about to start!",
  ],
  player1_2p: (playerName) =>
    `Prepare for the battle, ${playerName}! Arrange your fleet while your opponent looks away.`,
  player2_2p: (playerName) =>
    `It's your turn now, ${playerName}! Deploy your fleet once your opponent isn't watching.`,
};

const gameEnd = {
  win_1p: ["VICTORY!", "Your fleet sails victorious across the seven seas!"],
  defeat_1p: ["GAME OVER!", "Your fleet has been reclaimed by the sea..."],
  win_2p: (winnerPlayerName, defeatedPlayerName) => [
    `Well done, ${winnerPlayerName}!`,
    `All ${defeatedPlayerName}'s ships are lost to the depths..`,
  ],
};

export function getHomeViewMessage() {
  return home;
}

export function getEditInstructionsMessage() {
  return editInstructions;
}

export function getDeployFleetMessage(playerName, isPlayer1, versusAi) {
  if (versusAi) {
    if (isPlayer1) {
      return deployFleet.player1_1p;
    } else {
      return deployFleet.player2_1p;
    }
  } else {
    if (isPlayer1) {
      return deployFleet.player1_2p(playerName);
    } else {
      return deployFleet.player2_2p(playerName);
    }
  }
}

export function getGameEndMessage(
  winnerPlayerName,
  defeatedPlayerName,
  versusAi,
  isWinnerAi
) {
  if (versusAi) {
    if (isWinnerAi) {
      return gameEnd.defeat_1p;
    } else {
      return gameEnd.win_1p;
    }
  } else {
    return gameEnd.win_2p(winnerPlayerName, defeatedPlayerName);
  }
}
