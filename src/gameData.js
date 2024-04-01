// gameData.js
const { fetchData } = require("./fetchData");
const { getTeam, getOpponent } = require("./teamData");

const lastPeriod = {
  SO: "a Shoot Out",
  OT: "Overtime",
  REG: "Regulation",
};

const display = {
  Tied: ["Currently Tied", "yellow"],
  Winning: ["Yes, Currently!", "green"],
  Losing: ["Not Currently", "red"],
  Won: ["YES", "green"],
  Lost: ["NO", "red"],
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

  const resultString = !status.isLive
    ? `The Colorado Avalanche ${status.status} (${game.homeTeam.score}-${
        game.awayTeam.score
      }) against the ${opponentName} in ${
        lastPeriod[game.gameOutcome.lastPeriodType]
      } on ${parseDate(game.gameDate)}`
    : `The Colorado Avalanche are currently ${status.status} against the ${opponentName} in ${game.venue.default}`;

  return {
    homeLogo: game.homeTeam.logo,
    awayLogo: game.awayTeam.logo,
    resultString,
    displayStatus: display[status.status],
  };
}

async function fetchNextGameData() {
  const game = await getScheduleData("FUT");
  if (!game) {
    return { text: "END OF SEASON", logo: null };
  }

  const opponent = await getOpponent(game);
  const opponentName = await getTeam(opponent.id);
  const text = `Next Game: ${parseDate(game.gameDate)} vs ${opponentName} at ${
    game.venue.default
  }`;
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

function parseDate(dateStr) {
  const date = new Date(`${dateStr}T15:00:00.000Z`);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    daySuffix: ["st", "nd", "rd", "th"],
  };

  const day = date.getUTCDate();
  const suffix = options.daySuffix[(day - 1) % 10] || options.daySuffix[3];
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(day.toString(), day + suffix);
  return formattedDate;
}

module.exports = { fetchPrevGameData, fetchNextGameData };
