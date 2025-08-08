const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testDirectLoginFlow() {
    console.log('🧪 Testing Direct Email-OTP Login Flow...\n');
    
    try {
        // Step 1: Send login OTP
        console.log('1. Sending login OTP...');
        const sendLoginOTPResponse = await axios.post(`${BASE_URL}/auth/send-login-otp`, {
            studentId: 'DIRECT123',
            email: 'direct@example.com'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login OTP sent successfully:', sendLoginOTPResponse.data);
        
        const otp = sendLoginOTPResponse.data.otp;
        
        // Step 2: Verify OTP and login
        console.log('\n2. Verifying OTP and logging in...');
        const verifyLoginOTPResponse = await axios.post(`${BASE_URL}/auth/verify-login-otp`, {
            studentId: 'DIRECT123',
            email: 'direct@example.com',
            otp: otp
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Direct login successful:', verifyLoginOTPResponse.data);
        
        // Step 3: Test profile with token
        const token = verifyLoginOTPResponse.data.data.token;
        console.log('\n3. Testing profile with login token...');
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile access successful:', profileResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

async function testExistingUserLogin() {
    console.log('\n🧪 Testing Direct Login with Existing User...\n');
    
    try {
        // Step 1: Send login OTP for existing user
        console.log('1. Sending login OTP for existing user...');
        const sendLoginOTPResponse = await axios.post(`${BASE_URL}/auth/send-login-otp`, {
            studentId: 'OTP12345', // This user was created in previous tests
            email: 'otp@example.com'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login OTP sent successfully:', sendLoginOTPResponse.data);
        
        const otp = sendLoginOTPResponse.data.otp;
        
        // Step 2: Verify OTP and login
        console.log('\n2. Verifying OTP and logging in...');
        const verifyLoginOTPResponse = await axios.post(`${BASE_URL}/auth/verify-login-otp`, {
            studentId: 'OTP12345',
            email: 'otp@example.com',
            otp: otp
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Direct login successful for existing user:', verifyLoginOTPResponse.data);
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

async function testErrorCases() {
    console.log('\n🧪 Testing Error Cases...\n');
    
    try {
        // Test 1: Invalid OTP
        console.log('1. Testing invalid OTP...');
        const invalidOTPResponse = await axios.post(`${BASE_URL}/auth/verify-login-otp`, {
            studentId: 'DIRECT123',
            email: 'direct@example.com',
            otp: '000000'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('❌ Should have failed with invalid OTP');
    } catch (error) {
        console.log('✅ Correctly rejected invalid OTP:', error.response?.data?.message);
    }
    
    try {
        // Test 2: Missing fields
        console.log('\n2. Testing missing fields...');
        const missingFieldsResponse = await axios.post(`${BASE_URL}/auth/send-login-otp`, {
            studentId: 'DIRECT123'
            // Missing email
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('❌ Should have failed with missing email');
    } catch (error) {
        console.log('✅ Correctly rejected missing fields:', error.response?.data?.message);
    }
}

// Run tests
async function runTests() {
    await testDirectLoginFlow();
    await testExistingUserLogin();
    await testErrorCases();
}

runTests().catch(console.error); 