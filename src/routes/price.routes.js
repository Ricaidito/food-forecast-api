const priceController = require("../controllers/price.controller");
const express = require("express");

const router = express.Router();

// GET /prices
router.get("/:productUrl", priceController.getPriceHistory);

module.exports = router;
