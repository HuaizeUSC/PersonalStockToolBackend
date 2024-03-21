const Portfolio = require("../models/portfolioModel");
let Money = 25000000.0;

const updatePortfolio = async function (req, res) {
  try {
    let { ticker, name, quantity, avgcost, totalcost, change, price, marketvalue } = req.body;
    ticker = ticker.toUpperCase();
    let listitem = await Portfolio.findOne({ ticker });
    if (listitem) {
      if (quantity === 0) {
        await Portfolio.deleteOne({ ticker });
        return res.status(200).json({ type: "success", message: "Successfully remove portfolio" });
      } else {
        listitem.name = name;
        listitem.quantity = quantity;
        listitem.avgcost = avgcost;
        listitem.totalcost = totalcost;
        listitem.change = change;
        listitem.price = price;
        listitem.marketvalue = marketvalue;
      }
    } else {
      listitem = new Portfolio({
        ticker,
        name,
        quantity,
        avgcost,
        totalcost,
        change,
        price,
        marketvalue,
      });
    }
    await listitem.save();
    return res.status(200).json({ type: "success", message: "Successfully update portfolio" });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getSinglePortfolio = async function (req, res) {
  try {
    let { ticker } = req.query;
    ticker = ticker.toUpperCase();
    const singlePortfolio = await Portfolio.findOne({ ticker });
    if (!Portfolio) {
      return res.status(404).json({ type: "warning", message: "Cannot fount the ticker in Portfolio" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get a single Portfolio", data: singlePortfolio });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getEntirePortfolio = async function (req, res) {
  try {
    const Portfolios = await Portfolio.find();
    if (Portfolio.length === 0) {
      return res.status(404).json({ type: "warning", message: "Portfolio is empty" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get all Portfolios", data: Portfolios });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

module.exports = {
  getSinglePortfolio,
  getEntirePortfolio,
  updatePortfolio,
};
