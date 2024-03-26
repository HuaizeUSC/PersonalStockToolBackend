const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", stockRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/portfolio", portfolioRoutes);

module.exports = app;
