import { verifyToken } from '../utils/jwt.mjs';
import User from "../models/user.mjs"

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

export const requireOwner = (req, res, next) => {

    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    }

}

export const requireAdmin = async (req, res, next) => {

    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const user = await User.getUser(req.user.id)

    console.log(user)

    if(user.is_admin != 1) return res.status(403).json({message: "Forbidden"});
    next()

}