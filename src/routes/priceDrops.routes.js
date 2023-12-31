const priceDropsController = require("../controllers/priceDrops.controller");
const express = require("express");

const router = express.Router();

// GET /price-drops
router.get("/", priceDropsController.getPriceDrops);
router.get("/week", priceDropsController.getPriceDropsOfTheWeek);
router.get("/send", priceDropsController.sendPriceDrops);

// POST /price-drops
router.post("/dates", priceDropsController.getPriceDropsBetweenDates);

module.exports = router;
