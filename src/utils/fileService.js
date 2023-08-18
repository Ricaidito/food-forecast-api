const path = require("path");
const fs = require("fs");

const getDefaultProfilePicture = () => {
  const defaultProfilePicPath = path.join(
    __dirname,
    "..",
    "assets",
    "default-pic.jpeg"
  );
  imageBuffer = fs.readFileSync(defaultProfilePicPath);
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
  getWelcomeEmailTemplate,
};
