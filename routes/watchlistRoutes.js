const express = require("express");
const router = express.Router();
const watchlistController = require("../controller/watchlistController");

router.post("/update", watchlistController.updateWatchlist);
router.post("/remove", watchlistController.removeWatchlist);
router.get("/check", watchlistController.checkWatchlist);
router.get("/all", watchlistController.getEntireWatchlist);

module.exports = router;
