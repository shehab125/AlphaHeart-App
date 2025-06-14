const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email function
exports.sendEmail = async ({ email, subject, message }) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Medical Appointments" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2c3e50;">${subject}</h2>
        <p style="color: #34495e; line-height: 1.6;">${message}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated message, please do not reply.
        </p>
      </div>`,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}; 