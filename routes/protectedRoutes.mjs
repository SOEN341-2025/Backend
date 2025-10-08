import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.mjs';

const router = express.Router();

// Example protected route - requires JWT token
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user // User info from JWT token
    });
});

// Example optionally protected route - works with or without token
router.get('/public-data', optionalAuth, (req, res) => {
    if (req.user) {
        res.json({
            message: 'Welcome back, authenticated user!',
            user: req.user,
            data: 'Private data for logged-in users'
        });
    } else {
        res.json({
            message: 'Welcome, guest!',
            data: 'Public data for everyone'
        });
    }
});

export default router;