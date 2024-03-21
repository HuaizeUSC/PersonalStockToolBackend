const express = require("express");
const router = express.Router();
const watchlistController = require("../controller/watchlistController");

router.post("/update", watchlistController.updateWatchlist);
router.post("/remove", watchlistController.removeWatchlist);
router.get("/all", watchlistController.getEntireWatchlist);

module.exports = router;
