const paymentsController = require("../controllers/payments.controller");
const express = require("express");

const router = express.Router();

router.post("/create-payment-intent", paymentsController.createPaymentIntent);

module.exports = router;
