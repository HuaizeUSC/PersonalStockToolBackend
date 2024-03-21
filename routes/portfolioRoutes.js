const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/PortfolioController");

router.post("/update", portfolioController.updatePortfolio);
router.get("/single", portfolioController.getSinglePortfolio);
router.get("/all", portfolioController.getEntirePortfolio);

module.exports = router;
