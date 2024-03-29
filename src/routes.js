// routes.js
const { getGameData, getGameResult } = require("./gameData");
const path = require("path");

function setupRoutes(app) {
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/status", async (request, response) => {
    try {
      const { prevGame, nextGame } = await getGameData();
      const resultString = await getGameResult(prevGame);
      const responseData = {
        prevGame,
        nextGame,
        resultString,
      };
      console.log(responseData);

      response.json({ responseData }); // Send JSON data
    } catch (error) {
      console.error("Error fetching game data:", error);
      response.status(500).send("Internal Server Error");
    }
  });
}

module.exports = { setupRoutes };
