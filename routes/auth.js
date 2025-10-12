const express = require('express');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

const router = express.Router();
const users = []; // Replace with DB in production

router.post('/register', async (req, res) => {
    const { name, email } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;

    await sendVerificationEmail(email, verificationLink);
    users.push({ name, email, verified: false });

    res.json({ message: 'Verification email sent' });
});

router.get('/verify/:token', (req, res) => {
    const { token } = req.params;

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        const user = users.find(u => u.email === email);
        if (user) {
            user.verified = true;
            return res.send('✅ Email verified successfully!');
        }

        res.status(404).send('User not found');
    } catch (err) {
        res.status(400).send('❌ Invalid or expired token');
    }
});

module.exports = router;