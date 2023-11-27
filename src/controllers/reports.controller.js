const pdfGenerator = require("../utils/pdfGenService");

const genPDF = async (req, res) => {
  const userId = req.params.userId;
  const pdfStream = await pdfGenerator.createPDF(userId);

  const currentDate = new Date();
  const reportDate = currentDate.toLocaleDateString().split("/");
  const [day, month, year] = reportDate;
  const formattedDate = `${year}_${month}_${day}`;

  const fileName = `reporte_${formattedDate}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  pdfStream.pipe(res);
  pdfStream.end();
};

module.exports = {
  genPDF,
};
