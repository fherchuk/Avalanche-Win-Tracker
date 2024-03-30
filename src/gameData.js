// gameData.js
const { fetchData } = require("./fetchData");
const { getTeamName } = require("./teamData");

const lastPeriod = {
  SO: "a Shoot Out",
  OT: "Overtime",
  REG: "Regulation",
};
let fetchedScheduleData;
const scheduleUrl =
  "https://api-web.nhle.com/v1/club-schedule-season/COL/20232024";

async function getGameData() {
  if (!fetchedScheduleData) {
    fetchedScheduleData = await fetchData(scheduleUrl);
  }

  let nextGame, prevGame;

  for (let i = 0; i < fetchedScheduleData.games.length; i++) {
    if (fetchedScheduleData.games[i].gameState == "FUT") {
      nextGame = fetchedScheduleData.games[i];
      prevGame = fetchedScheduleData.games[i - 1];
      break;
    }
  }
  getGameResult(prevGame);
  return { prevGame, nextGame };
}

async function getGameResult(game) {
  if (!game) {
    console.log("No previous game found.");
    return;
  }

  const isHomeGame = game.homeTeam.id == 21;

  if (
    (isHomeGame && game.homeTeam.score < game.awayTeam.score) ||
    (!isHomeGame && game.awayTeam.score < game.homeTeam.score)
  ) {
    return resultString("Lost", game);
  } else {
    return resultString("Won", game);
  }
}

async function resultString(result, game) {
  const last = game.gameOutcome.lastPeriodType;
  const oppTeamName = await getTeamName(game.awayTeam.id);
  return `The Colorado Avalanche ${result} (${game.homeTeam.score}-${game.awayTeam.score}) against the ${oppTeamName} in ${lastPeriod[last]} on ${game.gameDate}`;
}

module.exports = { getGameData, getGameResult };
