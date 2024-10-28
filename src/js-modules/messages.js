const gameEnd = {
  win1: ["VICTORY!", "Your fleet sails victorious across the seven seas!"],
  defeat1: ["GAME OVER!", "Your fleet has been reclaimed by the sea..."],
  win2: (winnerPlayerName, defeatedPlayerName) => [
    `Well done, ${winnerPlayerName}!`,
    `All ${defeatedPlayerName}'s ships are lost to the depths..`,
  ],
};

export function getGameEndMessage(
  winnerPlayerName,
  defeatedPlayerName,
  versusAi,
  isWinnerAi
) {
  if (versusAi) {
    if (isWinnerAi) {
      return gameEnd.defeat1;
    } else {
      return gameEnd.win1;
    }
  } else {
    return gameEnd.win2(winnerPlayerName, defeatedPlayerName);
  }
}
