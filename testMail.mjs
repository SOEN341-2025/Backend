
import dotenv from 'dotenv';
dotenv.config();

import { sendVerificationEmail } from './utils/mailService.mjs';

const test = async () => {
    const recipient = 'yourfriend@example.com'; // test address (can be yours)
    const verificationLink = 'https://yourwebsite.com/verify?token=123456';

    try {
        await sendVerificationEmail(recipient, verificationLink);
        console.log('✅ Test email sent successfully!');
    } catch (err) {
        console.error('❌ Failed to send test email:', err.message);
    }
};

test();

// To run this test, execute: node testMail.mjs
// Ensure your .env file is correctly set up with email credentials and FRONTEND_URL