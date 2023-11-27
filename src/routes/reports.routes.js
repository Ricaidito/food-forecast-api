const reportsController = require("../controllers/reports.controller");
const express = require("express");

const router = express.Router();

// GET /reports
router.get("/:userId", reportsController.genPDF);

module.exports = router;
