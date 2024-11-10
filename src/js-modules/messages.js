// dialogs generated using Microsoft Copilot

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

const firstMove = {
  player_1p: "By fate’s roll, you start the battle.",
  playerAi_1p: "By fate’s roll, your enemy begins.",
  player_2p: (playerName) =>
    `By fate’s roll, you start the battle, ${playerName}!`,
};

const gameEnd = {
  win_1p: ["VICTORY!", "Your fleet sails victorious across the seven seas!"],
  defeat_1p: ["GAME OVER!", "Your fleet has been reclaimed by the sea..."],
  win_2p: (winnerPlayerName, defeatedPlayerName) => [
    `Well done, ${winnerPlayerName}!`,
    `All ${defeatedPlayerName}'s ships are lost to the depths..`,
  ],
};

const gameplayIdx = {
  miss: 0,
  hit: 0,
  hitAndSunk: 0,
  passingTurn: 0,
};

const gameplayMsg = {
  miss: [
    "Just a splash in the water...",
    "You missed the shot...",
    "No sign of ships here...",
    "Nothing but water there...",
    "Your aim was off...",
  ],
  hit: [
    "You've just hit a ship!",
    "You scored a nice shot!",
    "You reached the enemy!",
    "You found your mark!",
    "You've hit the target!",
  ],
  hitAndSunk: [
    "Your attack sinks a ship!",
    "Your shot sinks a ship!",
    "You brings down a ship!",
    "A direct hit and a sunken ship!",
    "You wrecks an enemy ship!",
  ],
  passingTurn: [
    "It's your turn!",
    "Aim your cannons!",
    "Prepare to strike!",
    "Take aim and fire!",
    "Arm your cannons!",
  ],
};

const gameplayMsgAi = {
  miss: [
    "but just gets a splash!",
    "but misses the shot!",
    "but finds no sign of you!",
    "but hits nothing but water!",
    "but misfires!",
  ],
  hit: [
    "and hits one of your ships...",
    "and scores a nice hit...",
    "and reaches your ship...",
    "and finds its mark...",
    "and targets you perfectly...",
  ],
  hitAndSunk: [
    "and makes your ship sink...",
    "and wrecks your ship...",
    "and sinks your vessel...",
    "and makes you lose a ship...",
    "and brings down your ship...",
  ],
  passingTurn: [
    "The enemy's turn is up next...",
    "The enemy is aiming the cannons...",
    "The enemy is ready to strike...",
    "The enemy takes aim to fire...",
    "The enemy armes the cannons...",
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

export function getFirstPlayerMessage(playerName, versusAi, isPlayerAi) {
  if (versusAi) {
    if (isPlayerAi) {
      return firstMove.playerAi_1p;
    } else {
      return firstMove.player_1p;
    }
  } else {
    return firstMove.player_2p(playerName);
  }
}

export function getGameplayStatusMessage(
  playerName,
  versusAi,
  isPlayerAi,
  type
) {
  // select the message object whether the current player is ai or not
  const msgObj = isPlayerAi ? gameplayMsgAi : gameplayMsg;

  // get the index of the message and update the next one
  gameplayIdx[type] = (gameplayIdx[type] + 1) % msgObj[type].length;
  const idx = gameplayIdx[type];

  return `${versusAi ? "" : playerName + "! "}${msgObj[type][idx]}`;
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
