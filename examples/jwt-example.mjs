// Example of what your login response will look like
import { generateToken, getTokenInfo } from '../utils/jwt.mjs';

// Simulate a successful login
const mockUser = {
    id: 123,
    email: 'user@example.com'
};

const token = generateToken(mockUser);
const tokenInfo = getTokenInfo();

const loginResponse = {
    message: "Login successful",
    token: token,
    tokenInfo: tokenInfo,
    user: {
        id: mockUser.id,
        email: mockUser.email
    }
};

console.log('=== JWT LOGIN EXAMPLE ===');
console.log(JSON.stringify(loginResponse, null, 2));

console.log('\n=== HOW TO USE THE TOKEN ===');
console.log('Include in your requests as:');
console.log('Authorization: Bearer ' + token);

console.log('\n=== TOKEN STRUCTURE ===');
console.log('Algorithm: HS256 (HMAC SHA256)');
console.log('Expiry: 1 hour');
console.log('Token parts:', token.split('.').length, '(header.payload.signature)');