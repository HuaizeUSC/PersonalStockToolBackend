const express = require("express");
const router = express.Router();
const stockController = require("../controller/stockController");

router.get("/description", stockController.getCompanyDescription);
router.get("/historicdata", stockController.getHistoricData);
router.get("/historicdatahour", stockController.getHistoricHourlyData);
router.get("/latestprice", stockController.getLatestPrice);
router.get("/autocomplete", stockController.getAutocomplete);
router.get("/news", stockController.getNews);
router.get("/trends", stockController.getTrends);
router.get("/insidersentiment", stockController.getInsiderSentiment);
router.get("/peers", stockController.getPeers);
router.get("/earnings", stockController.getEarnings);

module.exports = router;
