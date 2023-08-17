const basketController = require("../controllers/basket.controller");
const express = require("express");

const router = express.Router();

// GET /baskets
router.get("/", basketController.getLatestBasket);
router.get("/info", basketController.getBasketInfo);

module.exports = router;
