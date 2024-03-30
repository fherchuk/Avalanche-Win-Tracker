// teamData.js
const { fetchData } = require("./fetchData");

let fetchedTeamData;
const teamsUrl = "https://api.nhle.com/stats/rest/en/team/";

async function getTeamName(teamID) {
  if (!fetchedTeamData) {
    fetchedTeamData = await fetchData(teamsUrl);
  }
  const team = fetchedTeamData.data.find((element) => element.id == teamID);
  if (team) {
    return team.fullName;
  }
}

async function getOpponentId(game) {
  if (game.awayTeam.id != 21) {
    return game.awayTeam.id;
  } else {
    return game.homeTeam.id;
  }
}

module.exports = { getTeamName, getOpponentId };
