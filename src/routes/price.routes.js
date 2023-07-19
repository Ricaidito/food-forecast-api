const priceController = require("../controllers/price.controller");
const express = require("express");

const router = express.Router();

// GET /prices
router.get("/:productUrl", priceController.getPriceHistory);
router.get(
  "/compare-products/:productId1/:productId2",
  priceController.compareProductPrices
);

module.exports = router;
