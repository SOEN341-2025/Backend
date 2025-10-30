import nodemailer from "nodemailer"

const sendVerificationEmail = async (email, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification',
        html: `
      <h3>Welcome!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">Verify My Email</a>
      <p>This link expires in 1 hour.</p>
    `,
    };

    await transporter.sendMail(message);
};

module.exports = sendVerificationEmail;

