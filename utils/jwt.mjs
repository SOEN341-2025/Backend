import jwt from 'jsonwebtoken';

// TODO Change before deployment
// Simple secret key for development (in production, use environment variables)
const JWT_SECRET = 'your-simple-secret-key-2025';

// Token expiration time (1 hour)
const JWT_EXPIRY = '1h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing user information
 * @param {string} user.id - User ID
 * @param {string} user.email - User email
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256' // Simple HMAC SHA256 hash function
    });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};