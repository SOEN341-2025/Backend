import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateToken, verifyToken, getTokenInfo } from '../utils/jwt.mjs';

describe('JWT Token Tests', () => {
    
    const mockUser = {
        id: 1,
        email: 'test@example.com'
    };

    test('generateToken should create a valid JWT token', () => {
        const token = generateToken(mockUser);
        
        assert.strictEqual(typeof token, 'string');
        assert.strictEqual(token.split('.').length, 3); // JWT has 3 parts separated by dots
        assert.strictEqual(token.length > 50, true); // Token should be reasonably long
    });

    test('verifyToken should decode a valid token correctly', () => {
        const token = generateToken(mockUser);
        const decoded = verifyToken(token);
        
        assert.strictEqual(decoded.id, mockUser.id);
        assert.strictEqual(decoded.email, mockUser.email);
        assert.strictEqual(typeof decoded.iat, 'number'); // Issued at timestamp
        assert.strictEqual(typeof decoded.exp, 'number'); // Expiration timestamp
    });

    test('verifyToken should reject invalid tokens', () => {
        const invalidToken = 'invalid.token.here';
        
        assert.throws(() => {
            verifyToken(invalidToken);
        }, {
            message: 'Invalid or expired token'
        });
    });

    test('token should expire after 1 hour', () => {
        const token = generateToken(mockUser);
        const decoded = verifyToken(token);
        
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Token should expire approximately 1 hour from now (with small tolerance)
        const timeDiff = expirationTime - currentTime;
        assert.strictEqual(timeDiff > (oneHour - 1000), true); // Within 1 second tolerance
        assert.strictEqual(timeDiff <= oneHour, true);
    });

    test('getTokenInfo should return correct information', () => {
        const info = getTokenInfo();
        
        assert.strictEqual(info.message, "JWT token generated successfully");
        assert.strictEqual(info.details.algorithm, "HS256 (HMAC SHA256)");
        assert.strictEqual(info.details.expiry, "1 hour");
        assert.strictEqual(typeof info.details.usage, 'string');
    });
});