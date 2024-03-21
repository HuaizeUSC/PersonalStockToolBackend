const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  percent: { type: Number, required: true },
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema, "watchlist");

module.exports = Watchlist;
