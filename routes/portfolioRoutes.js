const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/portfolioController");
const portfolio = require("../models/portfolioModel");

router.post("/update", portfolioController.updatePortfolio);
router.post("/remove", portfolioController.removeSinglePortfolio);
router.get("/single", portfolioController.getSinglePortfolio);
router.get("/all", portfolioController.getEntirePortfolio);
router.get("/money", portfolioController.getMoney);
router.post("/money", portfolioController.updateMoney);

module.exports = router;
