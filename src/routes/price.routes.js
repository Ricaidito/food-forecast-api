const priceController = require("../controllers/price.controller");
const express = require("express");

const router = express.Router();

// GET /prices
router.get("/:productUrl", priceController.getPriceHistory);

// POST /prices
router.post("/compare-products", priceController.compareProductPrices);

module.exports = router;
