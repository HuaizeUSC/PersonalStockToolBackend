const Watchlist = require("../models/watchlistModel");

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

const getEntireWatchlist = async function (req, res) {
  try {
    const watchlist = await Watchlist.find();
    if (watchlist.length === 0) {
      return res.status(404).json({ type: "warning", message: "Watchlist is empty" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get all watchlist", data: watchlist });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

module.exports = {
  updateWatchlist,
  removeWatchlist,
  getEntireWatchlist,
};
