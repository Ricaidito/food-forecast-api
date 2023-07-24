const nodeMailer = require("nodemailer");
const emailConfig = require("../configs/emailConfig");

const transporter = nodeMailer.createTransport(emailConfig);

const sendEmail = async (email, subject, text) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
