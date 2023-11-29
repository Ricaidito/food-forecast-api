const pdfGenerator = require("../utils/pdfGenService");
const UserReport = require("../models/userReports.model");

const getGeneratedPDFsForUser = async (req, res) => {
  const userId = req.params.userId;
  const userReports = await UserReport.find({ userId });

  res.status(200).json(userReports);
};

const genPDF = async (req, res) => {
  const userId = req.params.userId;
  const [pdfStream, fileName] = await pdfGenerator.createPDF(userId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  pdfStream.pipe(res);
  pdfStream.end();
};

const genPDFFromData = async (req, res) => {
  const pdfId = req.params.pdfId;
  const pdfExists = await UserReport.exists({ _id: pdfId });

  if (!pdfExists)
    return res.status(404).json({
      message: "PDF not found",
    });

  const [pdfStream, fileName] = await pdfGenerator.createPDFFromData(pdfId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  pdfStream.pipe(res);
  pdfStream.end();
};

module.exports = {
  getGeneratedPDFsForUser,
  genPDF,
  genPDFFromData,
};
