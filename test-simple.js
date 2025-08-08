const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthEndpoints() {
    console.log('🧪 Testing Auth Endpoints...\n');
    
    try {
        // Test 1: Check if server is running
        console.log('1. Testing server health...');
        const healthResponse = await axios.get('http://localhost:5000/');
        console.log('✅ Server is running:', healthResponse.data);
        
        // Test 2: Test auth route
        console.log('\n2. Testing auth route...');
        const authTestResponse = await axios.get(`${BASE_URL}/auth/test`);
        console.log('✅ Auth route is working:', authTestResponse.data);
        
        // Test 3: Test register with proper headers
        console.log('\n3. Testing register endpoint...');
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            studentId: 'TEST12345',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Register successful:', registerResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
    }
}

testAuthEndpoints(); 