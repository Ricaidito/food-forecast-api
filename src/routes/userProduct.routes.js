const userProductController = require("../controllers/userProduct.controller");
const express = require("express");
const multer = require("multer");
const { fileFilter, limits } = require("../configs/imageConfig");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const router = express.Router();

// GET /user-products
router.get("/:userId/products", userProductController.getUserProducts);
router.get(
  "/:userId/products/:productId",
  userProductController.getUserProduct
);

// POST /user-products
router.post(
  "/:userId/products",
  upload.single("productImage"),
  userProductController.createUserProduct
);

// PUT /user-products
router.put(
  "/:userId/products/:productId",
  userProductController.updateUserProductInfo
);
router.put(
  "/:userId/products/:productId/price",
  userProductController.updateUserProductPrice
);

// DELETE /user-products
router.delete(
  "/:userId/products/:productId",
  userProductController.deleteUserProduct
);
router.delete("/:userId/products", userProductController.deleteAllUserProducts);

module.exports = router;