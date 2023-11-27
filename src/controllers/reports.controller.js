const pdfGenerator = require("../utils/pdfGenService");

const genPDF = async (req, res) => {
  const userId = req.params.userId;
  await pdfGenerator.createPDF(userId);
  res.status(200).json({ message: "PDF generated successfully" });
};

module.exports = {
  genPDF,
};
