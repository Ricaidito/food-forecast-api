const productController = require("../controllers/product.controller");
const express = require("express");

const router = express.Router();

// GET /products
router.get("/", productController.getProducts);
router.get("/with-price", productController.getProductsWithPriceHistory);
router.get("/:productId", productController.getProductById);
router.get(
  "/with-price/:productId",
  productController.getProductByIdWithPriceHistory
);

module.exports = router;
