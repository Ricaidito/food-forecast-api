const express = require("express");
const userConfigController = require("../controllers/userConfig.controller");

const router = express.Router();

// GET /user-config
router.get("/config/:userId", userConfigController.getUserConfig);

// POST /user-config
router.post(
  "/config/watch-list/:userId/:productId",
  userConfigController.addProductToWatchList
);

// PUT /user-config
router.put(
  "/config/notification-threshold/:userId",
  userConfigController.updateNotificationThreshold
);

// DELETE /user-config
router.delete(
  "/config/watch-list/:userId/:productId",
  userConfigController.removeProductFromWatchList
);
router.delete(
  "/config/watch-list/:userId",
  userConfigController.clearWatchList
);

module.exports = router;
