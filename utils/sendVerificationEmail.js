// sendVerificationEmail.js
import mailService from './mailService.js'; // adjust path based on your structure

export const sendVerificationEmail = (userEmail, verificationLink) => {
    const subject = 'Verify your Email Address';
    const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to our platform!</h2>
      <p>To complete your registration, please click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="display:inline-block; padding:10px 15px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Verify Email
      </a>
      <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
      <p>${verificationLink}</p>
    </div>
  `;

    mailService.send({
        to: userEmail,
        subject,
        html,
    });
};