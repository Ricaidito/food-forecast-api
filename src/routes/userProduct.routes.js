const express = require("express");
const multer = require("multer");
const { fileFilter, limits } = require("../configs/imageConfig");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const userProductController = require("../controllers/userProduct.controller");

const router = express.Router();

// GET /user-products
router.get("/:userId/products", userProductController.getUserProducts);
router.get("/:userId/products/:id", userProductController.getUserProduct);

// POST /user-products
router.post(
  "/:userId/products",
  upload.single("productImage"),
  userProductController.createUserProduct
);

// PUT /user-products
router.put(
  "/:userId/products/:id",
  userProductController.updateUserProductInfo
);
router.put(
  "/:userId/products/:id/price",
  userProductController.updateUserProductPrice
);

// DELETE /user-products
router.delete("/:userId/products/:id", userProductController.deleteUserProduct);

module.exports = router;
