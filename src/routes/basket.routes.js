const express = require("express");
const basketController = require("../controllers/basket.controller");

const router = express.Router();

// GET /basket
router.get("/", basketController.getLatestBasket);

module.exports = router;
