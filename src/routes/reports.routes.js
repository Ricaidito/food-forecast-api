const reportsController = require("../controllers/reports.controller");
const express = require("express");

const router = express.Router();

// GET /reports
router.get("/history/:userId", reportsController.getGeneratedPDFsForUser);
router.get("/:userId", reportsController.genPDF);
router.get("/data/:pdfId", reportsController.genPDFFromData);

module.exports = router;
