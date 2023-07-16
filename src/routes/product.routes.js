const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

// GET /products
router.get("/", productController.getProducts);
router.get("/with-price", productController.getProductsWithPriceHistory);
router.get("/:id", productController.getProductById);
router.get("/with-price/:id", productController.getProductByIdWithPriceHistory);

module.exports = router;
