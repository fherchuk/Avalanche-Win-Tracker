// teamData.js
const { fetchData } = require("./fetchData");

let fetchedTeamData;
const teamsUrl = "https://api.nhle.com/stats/rest/en/team/";

async function getTeam(teamID) {
  fetchedTeamData ??= await fetchData(teamsUrl);
  const team = fetchedTeamData.data.find((element) => element.id == teamID);
  return team.fullName || "TEAM NOT FOUND";
}

async function getOpponent(game) {
  return game.awayTeam.id !== 21 ? game.awayTeam : game.homeTeam;
}

module.exports = { getTeam, getOpponent };
