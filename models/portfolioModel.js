const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgcost: { type: Number, required: true },
  totalcost: { type: Number, required: true },
  change: { type: Number, required: true },
  price: { type: Number, required: true },
  marketvalue: { type: Number, required: true },
});

const portfolio = mongoose.model("portfolio", portfolioSchema, "portfolio");

module.exports = portfolio;
