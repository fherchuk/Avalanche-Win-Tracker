// routes.js
const path = require("path");
const { getGameData, getGameResult } = require("./gameData");
const { getTeamName, getOpponentId } = require("./teamData");

function setupRoutes(app) {
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/status", async (request, response) => {
    try {
      const { prevGame, nextGame } = await getGameData();
      const resultString = await getGameResult(prevGame);
      const nextTeam = await getTeamName(await getOpponentId(nextGame));
      const responseData = {
        prevGame,
        nextGame,
        resultString,
        nextTeam,
      };
      response.json({ responseData }); // Send JSON data
    } catch (error) {
      console.error("Error fetching game data:", error);
      response.status(500).send("Internal Server Error");
    }
  });
}

module.exports = { setupRoutes };
