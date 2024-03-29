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

module.exports = { getTeamName };
