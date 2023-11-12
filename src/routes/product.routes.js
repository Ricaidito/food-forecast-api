const productController = require("../controllers/product.controller");
const express = require("express");

const router = express.Router();

// GET /products
router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductById);
router.get(
  "/with-price/:productId",
  productController.getProductByIdWithPriceHistory
);
router.get(
  "/product-info/:productId",
  productController.getProductByIdWithPrice
);

// POST /products
router.post("/with-price", productController.getProductsByIdWithPriceHistory);

module.exports = router;
