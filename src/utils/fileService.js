const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const getDefaultProfilePicture = () => {
  const defaultProfilePicPath = path.join(
    __dirname,
    "..",
    "assets",
    "default-pic.jpeg"
  );
  const imageBuffer = fs.readFileSync(defaultProfilePicPath);
  return imageBuffer;
};

const getDefaultUserProductPicture = () => {
  const defaultProductPicPath = path.join(
    __dirname,
    "..",
    "assets",
    "default-product-pic.jpeg"
  );
  const imageBuffer = fs.readFileSync(defaultProductPicPath);
  return imageBuffer;
};

const parseExcelFile = excelBuffer => {
  const workbook = XLSX.read(excelBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const products = XLSX.utils.sheet_to_json(worksheet);

  for (const product of products) {
    if (
      !product.productName ||
      !product.price ||
      !product.category ||
      !product.origin
    ) {
      return null;
    }
  }

  return products;
};

const getExcelTemplateFilePath = () => {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    "productsTemplate.xlsx"
  );
  return filePath;
};

const getWelcomeEmailTemplate = () => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    "welcomeEmail.ejs"
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

const getPriceDropEmailTemplate = () => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    "priceDrop.ejs"
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

const getSubscriptionEmailTemplate = () => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    "subEmail.ejs"
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

const cancelSubscriptionEmailTemplate = () => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    "cancelEmail.ejs"
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

module.exports = {
  getDefaultProfilePicture,
  getDefaultUserProductPicture,
  parseExcelFile,
  getExcelTemplateFilePath,
  getWelcomeEmailTemplate,
  getPriceDropEmailTemplate,
  getSubscriptionEmailTemplate,
  cancelSubscriptionEmailTemplate,
};
