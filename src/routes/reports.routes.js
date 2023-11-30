const reportsController = require("../controllers/reports.controller");
const express = require("express");

const router = express.Router();

// GET /reports
router.get("/history/:userId", reportsController.getGeneratedPDFsForUser);
router.get("/:userId", reportsController.genPDF);
router.get("/data/:pdfId", reportsController.genPDFFromData);

// DELETE /reports
router.delete("/:pdfId", reportsController.deleteReportById);
router.delete("/history/:userId", reportsController.deleteAllReportsForUser);

module.exports = router;
