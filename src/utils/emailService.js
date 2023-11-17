const nodeMailer = require("nodemailer");
const ejs = require("ejs");
const emailConfig = require("../configs/emailConfig");
const fileService = require("./fileService");

const transporter = nodeMailer.createTransport(emailConfig);

const sendWelcomeEmail = async (email, personName) => {
  try {
    const emailTemplate = fileService.getWelcomeEmailTemplate();
    const emailContent = ejs.render(emailTemplate, { personName });
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: "Bienvenido(a) a Food Forecast",
      html: emailContent,
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

const sendProductPriceDropEmail = async (email, personName, priceDrops) => {
  try {
    const emailTemplate = fileService.getPriceDropEmailTemplate();
    const emailContent = ejs.render(emailTemplate, {
      personName: personName,
      priceDrops: priceDrops,
    });
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject:
        "Cambio de precio en producto de tu lista de seguimiento - Food Forecast",
      html: emailContent,
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendProductPriceDropEmail,
};
