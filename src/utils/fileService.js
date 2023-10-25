const path = require("path");
const fs = require("fs");

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

module.exports = {
  getDefaultProfilePicture,
  getDefaultUserProductPicture,
  getWelcomeEmailTemplate,
};
