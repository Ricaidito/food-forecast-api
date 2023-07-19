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
router.get(
  "/search/:searchString",
  productController.searchProductsByProductName
);
router.get(
  "/product-info/:productId",
  productController.getProductByIdWithPrice
);

module.exports = router;
