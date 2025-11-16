import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to, token) => {
    const subject = 'Verify Your Email Address';
    const html = `
        <div style ="font-family: Arial, sans-serif; line-height: 1.6;">
         <h2 style="color: #333;">Welcome to Our Service!</h2>
         <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" 
            style="display:inline-block;padding:10px 20px;margin:20px 0;
                   background-color:#28a745;color:#fff;text-decoration:none;
                   border-radius:5px;">Verify Email</a>
         <p>If you did not sign up for this account, please ignore this email.</p>
         <p>Best regards,<br/>The Team</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending verification email to ${to}:`, error);
        throw new Error('Could not send verification email.');
    }
};

/* export const sendPasswordResetEmail = async (to, token) => {
    const subject = 'Reset Your Password';
    const html = `
        <div style ="font-family: Arial, sans-serif; line-height: 1.6;">
         <h2 style="color: #333;">Password Reset Request</h2>
         <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" 
            style="display:inline-block;padding:10px 20px;margin:20px 0;
                   background-color:#dc3545;color:#fff;text-decoration:none;
                   border-radius:5px;">Reset Password</a>
         <p>If you did not request a password reset, please ignore this email.</p>
         <p>Best regards,<br/>The Team</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${to}:`, error);
        throw new Error('Could not send password reset email.');
    }
};

export const sendWelcomeEmail = async (to) => {
    // Implementation for sending a welcome email can be added here
}; */