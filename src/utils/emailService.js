const nodeMailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const emailConfig = require("../configs/emailConfig");

const transporter = nodeMailer.createTransport(emailConfig);

const sendWelcomeEmail = async (email, personName) => {
  try {
    const emailTemplatePath = path.join(
      __dirname,
      "..",
      "templates",
      "welcomeEmail.ejs"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
    const emailContent = ejs.render(emailTemplate, { personName });
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: "Bienvenido(a) a Food Forecast",
      html: emailContent,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
};
