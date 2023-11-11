const paymentsController = require("../controllers/payments.controller");
const express = require("express");

const router = express.Router();

// GET /payments
router.get(
  "/get-subscription-details/:userId",
  paymentsController.getSubscriptionDetails
);
router.get("/get-customer/:userId", paymentsController.getCustomer);
router.get(
  "/cancel-subscription/:userId",
  paymentsController.cancelSubscription
);

// POST /payments
router.post(
  "/create-subscription/:userId",
  paymentsController.createSubscription
);

module.exports = router;
