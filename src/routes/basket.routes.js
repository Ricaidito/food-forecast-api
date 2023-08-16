const basketController = require("../controllers/basket.controller");
const express = require("express");

const router = express.Router();

// GET /baskets
router.get("/", basketController.getLatestBasket);
router.get("/compare", basketController.compareBasketsWithPrevious);

module.exports = router;
