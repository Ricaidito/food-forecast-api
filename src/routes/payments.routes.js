const paymentsController = require("../controllers/payments.controller");
const express = require("express");

const router = express.Router();

// POST /payments
router.post("/create-payment-intent", paymentsController.createPaymentIntent);
router.post("/create-subscription", paymentsController.createSubscription);

module.exports = router;
