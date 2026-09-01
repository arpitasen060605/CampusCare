const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Smart Complaint Support" <noreply@campuscare.edu>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } else {
    // Fallback mode for local dev: Output link safely to console
    console.log('\n=========================================================');
    console.log(`📧 [PASSWORD RESET EMAIL SENT]`);
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Reset URL: ${options.resetUrl}`);
    console.log('=========================================================\n');
  }
};

module.exports = sendEmail;
