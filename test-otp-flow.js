const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testOTPFlow() {
    console.log('🧪 Testing OTP Verification Flow...\n');
    
    try {
        // Step 1: Send OTP
        console.log('1. Sending OTP...');
        const sendOTPResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
            studentId: 'OTP12345',
            email: 'otp@example.com'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ OTP sent successfully:', sendOTPResponse.data);
        
        const otp = sendOTPResponse.data.otp;
        
        // Step 2: Verify OTP
        console.log('\n2. Verifying OTP...');
        const verifyOTPResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            studentId: 'OTP12345',
            email: 'otp@example.com',
            otp: otp
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ OTP verified successfully:', verifyOTPResponse.data);
        
        // Step 3: Complete registration
        console.log('\n3. Completing registration...');
        const completeRegistrationResponse = await axios.post(`${BASE_URL}/auth/complete-registration`, {
            studentId: 'OTP12345',
            email: 'otp@example.com',
            password: 'password123',
            firstName: 'OTP',
            lastName: 'User'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Registration completed:', completeRegistrationResponse.data);
        
        // Step 4: Test login with verified user
        console.log('\n4. Testing login with verified user...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            studentId: 'OTP12345',
            password: 'password123',
            rememberMe: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login successful:', loginResponse.data);
        
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
        const invalidOTPResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            studentId: 'OTP12345',
            email: 'otp@example.com',
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
        // Test 2: Login without verification
        console.log('\n2. Testing login without email verification...');
        const loginWithoutVerificationResponse = await axios.post(`${BASE_URL}/auth/login`, {
            studentId: 'UNVERIFIED123',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('❌ Should have failed without verification');
    } catch (error) {
        console.log('✅ Correctly rejected unverified user:', error.response?.data?.message);
    }
}

// Run tests
async function runTests() {
    await testOTPFlow();
    await testErrorCases();
}

runTests().catch(console.error); 