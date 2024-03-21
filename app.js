const express = require("express");
const stockRoutes = require("./routes/stockRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const app = express();
app.use(express.json());
app.use("/api", stockRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/portfolio", portfolioRoutes);

module.exports = app;
