import { verifyToken } from '../utils/jwt.mjs';

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.',
            message: 'Please include a valid JWT token in the Authorization header'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        res.status(403).json({ 
            error: 'Invalid token',
            message: error.message
        });
    }
};

/**
 * Middleware to optionally authenticate JWT tokens (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } catch (error) {
            // Token is invalid, but we continue without authentication
            req.user = null;
        }
    }

    next();
};