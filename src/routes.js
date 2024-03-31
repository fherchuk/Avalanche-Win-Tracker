// routes.js
const path = require("path");
const { fetchPrevGameData, fetchNextGameData } = require("./gameData");

function setupRoutes(app) {
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/status", async (request, response) => {
    try {
      const [prevGameData, nextGameData] = await Promise.all([
        fetchPrevGameData(),
        fetchNextGameData(),
      ]);
      const responseData = {
        prevGameData,
        nextGameData,
      };
      response.json({ responseData }); // Send JSON data
    } catch (error) {
      console.error("Error fetching game data:", error);
      response.status(500).send("Internal Server Error");
    }
  });
}

module.exports = { setupRoutes };
