// gameData.js
const { fetchData } = require("./fetchData");
const { getTeam, getOpponent } = require("./teamData");

const lastPeriod = {
  SO: "a Shoot Out",
  OT: "Overtime",
  REG: "Regulation",
};
let fetchedScheduleData;
const scheduleUrl =
  "https://api-web.nhle.com/v1/club-schedule-season/COL/20232024";

async function getScheduleData(index) {
  // If nullish, fetchData
  fetchedScheduleData ??= await fetchData(scheduleUrl);
  // Find the index of the first future game
  const gameIndex = fetchedScheduleData.games.findIndex(
    (game) => game.gameState === index
  );
  const gameData =
    gameIndex === -1
      ? (() => {
          let prevGameIndex = fetchedScheduleData.games.findIndex(
            (game) => game.gameState === "FUT"
          );
          return prevGameIndex !== -1
            ? fetchedScheduleData.games[prevGameIndex - 1]
            : null;
        })()
      : fetchedScheduleData.games[gameIndex];

  return gameData;
}

async function fetchPrevGameData() {
  const game =
    (await getScheduleData("LIVE")) || (await getScheduleData("OFF"));

  const status = getGameStatus(game);
  const opponent = await getOpponent(game);
  const opponentName = await getTeam(opponent.id);

  const result = !status.isLive
    ? `The Colorado Avalanche ${status.status} (${game.homeTeam.score}-${
        game.awayTeam.score
      }) against the ${opponentName} in ${
        lastPeriod[game.gameOutcome.lastPeriodType]
      } on ${game.gameDate}`
    : `The Colorado Avalanche are currently ${status.status} against the ${opponentName} in ${game.venue.default}`;

  return { homeLogo: game.homeTeam.logo, awayLogo: game.awayTeam.logo, result };
}

async function fetchNextGameData() {
  const game = await getScheduleData("FUT");
  if (!game) {
    return { text: "END OF SEASON", logo: null };
  }

  const opponent = await getOpponent(game);
  const opponentName = await getTeam(opponent.id);
  const text = `Next Game: ${game.gameDate} vs ${opponentName} at ${game.venue.default}`;
  const logo = opponent.logo;

  return { text, logo };
}

function getGameStatus(game) {
  if (!game) {
    console.log("Game Not Found");
    return;
  }

  const isLive = game.gameState === "LIVE" || game.gameState === "CRIT";
  const isTied = isLive && game.homeTeam.score === game.awayTeam.score;
  const isHomeGame = game.homeTeam.id === 21;

  const isHomeTeamWinning = isHomeGame
    ? game.homeTeam.score > game.awayTeam.score
    : game.awayTeam.score > game.homeTeam.score;

  let status = isTied
    ? "Tied"
    : isHomeTeamWinning && isLive
    ? "Winning"
    : isHomeTeamWinning && !isLive
    ? "Won"
    : !isHomeTeamWinning && isLive
    ? "Losing"
    : "Lost";

  return { status, isLive };
}

module.exports = { fetchPrevGameData, fetchNextGameData };
