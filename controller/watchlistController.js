const { default: axios } = require("axios");
const Watchlist = require("../models/watchlistModel");
const { FINNHUB_API } = require("../privateApi");

const updateWatchlist = async function (req, res) {
  try {
    let { ticker, name, price, change, percent } = req.body;
    ticker = ticker.toUpperCase();
    let listitem = await Watchlist.findOne({ ticker });
    if (listitem) {
      listitem.name = name;
      listitem.price = price;
      listitem.change = change;
      listitem.percent = percent;
    } else {
      listitem = new Watchlist({
        ticker,
        name,
        price,
        change,
        percent,
      });
    }
    await listitem.save();
    return res.status(200).json({ type: "success", message: "Successfully update watchlist" });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const removeWatchlist = async function (req, res) {
  try {
    let { ticker } = req.query;
    ticker = ticker.toUpperCase();
    const deletedStock = await Watchlist.findOneAndDelete({ ticker });
    if (!deletedStock) {
      return res.status(404).json({ type: "error", message: "Stock not fount in watchlist" });
    }
    return res.status(200).json({ type: "success", message: "Successfully remove from watchlist" });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const checkWatchlist = async function (req, res) {
  try {
    let { ticker } = req.query;
    ticker = ticker.toUpperCase();
    const checkStock = await Watchlist.findOne({ ticker });
    if (!checkStock) {
      return res.status(200).json({ type: "success", message: "Stock not fount in watchlist", data: false });
    }
    return res.status(200).json({ type: "success", message: "The ticker is in the watchlist", data: true });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getEntireWatchlist = async function (req, res) {
  try {
    const watchlist = await Watchlist.find();
    if (watchlist.length === 0) {
      return res.status(404).json({ type: "warning", message: "Currently you don't have any stock in your watchlist." });
    }
    for (const item of watchlist) {
      const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${item.ticker.toUpperCase()}&token=${FINNHUB_API}`;
      const response = await axios.get(apiUrl);
      const price = response.data;

      if (Object.keys(response.data).length != 0) {
        let listitem = await Watchlist.findOne({ ticker: item.ticker });
        listitem.name = item.name;
        listitem.ticker = item.ticker;
        listitem.price = price.c;
        listitem.change = price.d;
        listitem.percent = price.dp;
        await listitem.save();
      }
    }
    const updatedWatchlist = await Watchlist.find();
    return res.status(200).json({ type: "success", message: "Successfully get all watchlist", data: updatedWatchlist });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

module.exports = {
  updateWatchlist,
  removeWatchlist,
  getEntireWatchlist,
  checkWatchlist,
};
