const privateApi = require("../privateApi");
const FINNHUB_API = privateApi.FINNHUB_API;
const POLYGON_API = privateApi.POLYGON_API;

const DESCRIPTION_URL = "https://finnhub.io/api/v1/stock/profile2";
const HISTORICDATA_URL = "https://api.polygon.io/v2/aggs/ticker";
const LATESTPRICE_URL = "https://finnhub.io/api/v1/quote";
const AUTOCOMPLETE_URL = "https://finnhub.io/api/v1/search";
const NEWS_URL = "https://finnhub.io/api/v1/company-news";
const TRENDS_URL = "https://finnhub.io/api/v1/stock/recommendation";
const INSIDERSENTIMENT_URL = "https://finnhub.io/api/v1/stock/insider-sentiment";
const PEERS_URL = "https://finnhub.io/api/v1/stock/peers";
const EARNINGS_URL = "https://finnhub.io/api/v1/stock/earnings";

const axios = require("axios");
const utils = require("../utils/utils");

const getCompanyDescription = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${DESCRIPTION_URL}?symbol=${ticker}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the stock information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getHistoricData = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const apiUrl = `${HISTORICDATA_URL}/${ticker.toUpperCase()}/range/1/day/${utils.formatDateString(twoYearsAgo)}/${utils.formatDateString(today)}?adjusted=true&sort=asc&apiKey=${POLYGON_API}`;

    const response = await axios.get(apiUrl);
    if (response.data.queryCount === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the historic price information", data: response.data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getHistoricHourlyData = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrlLatest = `${LATESTPRICE_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API}`;
    const responseLatest = await axios.get(apiUrlLatest);

    const latestTimestamp = responseLatest.data.t;
    const latestTradingDay = new Date(latestTimestamp * 1000);
    const apiUrl = `${HISTORICDATA_URL}/${ticker.toUpperCase()}/range/1/hour/${utils.formatDateString(latestTradingDay)}/${utils.formatDateString(latestTradingDay)}?adjusted=true&sort=asc&apiKey=${POLYGON_API}`;
    const response = await axios.get(apiUrl);
    if (response.data.queryCount === 0) {
      return res.status(404).json({ type: "error", message: "No data found for the latest trading day. Please enter a valid ticker!" });
    }

    return res.status(200).json({ type: "success", message: "Successfully retrieved hourly price information for the latest trading day", data: response.data });
  } catch (error) {
    console.error("Error fetching historic hourly data:", error);
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getLatestPrice = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${LATESTPRICE_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the lastest price information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getNews = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 7);
    const apiUrl = `${NEWS_URL}?symbol=${ticker.toUpperCase()}&from=${utils.formatDateString(twoWeeksAgo)}&to=${utils.formatDateString(today)}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    const newsData = response.data;
    const filteredNews = newsData.filter((news) => news.headline && news.image).slice(0, 20);
    return res.status(200).json({ type: "success", message: "Successfully get the news information", data: filteredNews });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getAutocomplete = async function (req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${AUTOCOMPLETE_URL}?q=${q}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({
      type: "success",
      message: "Successfully get the autocomplete information",
      data: response.data.result.filter((item) => {
        return item.type === "Common Stock" && !item.symbol.includes(".");
      }),
    });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getTrends = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${TRENDS_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the trends information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getInsiderSentiment = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${INSIDERSENTIMENT_URL}?symbol=${ticker.toUpperCase()}&from=2022-01-01&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the insider sentiment information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getPeers = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${PEERS_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the peers information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

const getEarnings = async function (req, res) {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ type: "error", message: "Please enter a valid ticker!" });
    }
    const apiUrl = `${EARNINGS_URL}?symbol=${ticker.toUpperCase()}&token=${FINNHUB_API}`;
    const response = await axios.get(apiUrl);
    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ type: "error", message: "No data found. Please enter a valid ticker!" });
    }
    return res.status(200).json({ type: "success", message: "Successfully get the earnings information", data: response.data });
  } catch (error) {
    return res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

module.exports = {
  getCompanyDescription,
  getHistoricData,
  getHistoricHourlyData,
  getLatestPrice,
  getNews,
  getAutocomplete,
  getTrends,
  getInsiderSentiment,
  getEarnings,
  getPeers,
};
