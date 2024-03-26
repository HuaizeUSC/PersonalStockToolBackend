const Portfolio = require("../models/portfolioModel");
const Money = require("../models/moneyModel");
const { FINNHUB_API } = require("../privateApi");
const { default: axios } = require("axios");

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
    if (!singlePortfolio) {
      return res.status(404).json({ type: "warning", message: "Cannot fount the ticker in Portfolio", data: { ticker: "", name: "", quantity: 0, avgcost: 0, totalcost: 0, change: 0, price: 0, marketvalue: 0 } });
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
    for (const item of Portfolios) {
      const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${item.ticker.toUpperCase()}&token=${FINNHUB_API}`;
      const response = await axios.get(apiUrl);
      const price = response.data;

      if (Object.keys(response.data).length != 0) {
        let listitem = await Portfolio.findOne({ ticker: item.ticker });

        listitem.price = price.c;
        listitem.change = listitem.avgcost - price.c;
        listitem.percent = price.c * listitem.quantity;
        await listitem.save();
      }
    }
    const updatedPortfolio = await Portfolio.find();
    return res.status(200).json({ type: "success", message: "Successfully get all Portfolios", data: updatedPortfolio });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const removeSinglePortfolio = async function (req, res) {
  try {
    let { ticker } = req.query;
    ticker = ticker.toUpperCase();
    const singlePortfolio = await Portfolio.findOneAndDelete({ ticker });
    if (!singlePortfolio) {
      return res.status(404).json({ type: "warning", message: "Cannot fount the ticker in Portfolio", data: { ticker: "", name: "", quantity: 0, avgcost: 0, totalcost: 0, change: 0, price: 0, marketvalue: 0 } });
    }
    return res.status(200).json({ type: "success", message: "Successfully remove a single Portfolio", data: singlePortfolio });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getMoney = async function (req, res) {
  try {
    const money = await Money.findOne();
    return res.status(200).json({ type: "success", message: "Successfully get the money", data: money });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const updateMoney = async function (req, res) {
  try {
    const { quantity } = req.query;
    const money = await Money.findOne();
    money.money = quantity;
    money.save();
    return res.status(200).json({ type: "success", message: "Successfully update the money", data: money });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

module.exports = {
  getSinglePortfolio,
  getEntirePortfolio,
  updatePortfolio,
  removeSinglePortfolio,
  getMoney,
  updateMoney,
};
