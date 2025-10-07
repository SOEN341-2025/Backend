import fetch from 'node-fetch';

// Test JWT Login functionality
async function testJWTLogin() {
    console.log('🧪 Testing JWT Login Functionality\n');
    
    try {
        // Test 1: Login and get JWT token
        console.log('1️⃣ Testing Login (JWT Generation)...');
        const loginResponse = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@admin',
                password: '1234'
            })
        });

        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
            console.log('✅ Login Success!');
            console.log('📋 Response:', JSON.stringify(loginData, null, 2));
            
            const token = loginData.token;
            console.log('\n🎟️ JWT Token:', token);
            
            // Test 2: Use JWT token to access protected route
            console.log('\n2️⃣ Testing Protected Route with Valid Token...');
            const protectedResponse = await fetch('http://localhost:3000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (protectedResponse.ok) {
                const protectedData = await protectedResponse.json();
                console.log('✅ Protected Route Success!');
                console.log('📋 Response:', JSON.stringify(protectedData, null, 2));
            } else {
                console.log('❌ Protected Route Failed:', protectedResponse.status);
                const errorData = await protectedResponse.json();
                console.log('📋 Error:', JSON.stringify(errorData, null, 2));
            }
            
            // Test 3: Try with invalid token
            console.log('\n3️⃣ Testing Protected Route with Invalid Token...');
            const invalidResponse = await fetch('http://localhost:3000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer invalid.token.here'
                }
            });
            
            const invalidData = await invalidResponse.json();
            console.log('❌ Expected Error (Invalid Token):', invalidResponse.status);
            console.log('📋 Response:', JSON.stringify(invalidData, null, 2));
            
        } else {
            console.log('❌ Login Failed:', loginResponse.status);
            console.log('📋 Error:', JSON.stringify(loginData, null, 2));
        }
        
    } catch (error) {
        console.error('🚨 Test Error:', error.message);
    }
}

// Run the test
testJWTLogin();