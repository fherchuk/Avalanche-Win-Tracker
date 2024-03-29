// server.js
const express = require("express");
const path = require("path");
const { setupRoutes } = require("./routes");

const app = express();

setupRoutes(app);

app.use(express.static("public"));

app.listen(process.env.PORT || 5000, () =>
  console.log("app on http://localhost:5000")
);
