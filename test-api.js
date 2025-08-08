const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test registration
async function testRegister() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
            studentId: 'STU12345',
            email: 'student@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        });
        console.log('✅ Registration successful:', response.data);
        return response.data.data.token;
    } catch (error) {
        console.error('❌ Registration failed:', error.response?.data || error.message);
    }
}

// Test login with Student ID
async function testLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            studentId: 'STU12345',
            password: 'password123',
            rememberMe: true
        });
        console.log('✅ Login successful:', response.data);
        return response.data.data.token;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
}

// Test forgot password
async function testForgotPassword() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
            email: 'student@example.com'
        });
        console.log('✅ Forgot password successful:', response.data);
        return response.data.resetToken;
    } catch (error) {
        console.error('❌ Forgot password failed:', error.response?.data || error.message);
    }
}

// Test reset password
async function testResetPassword(token) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
            token: token,
            newPassword: 'newpassword123'
        });
        console.log('✅ Reset password successful:', response.data);
    } catch (error) {
        console.error('❌ Reset password failed:', error.response?.data || error.message);
    }
}

// Test profile with token
async function testProfile(token) {
    try {
        const response = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile successful:', response.data);
    } catch (error) {
        console.error('❌ Profile failed:', error.response?.data || error.message);
    }
}

// Test logout
async function testLogout() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/logout`);
        console.log('✅ Logout successful:', response.data);
    } catch (error) {
        console.error('❌ Logout failed:', error.response?.data || error.message);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Testing Student Authentication API...\n');
    
    // Test registration
    console.log('1. Testing Registration...');
    const token = await testRegister();
    
    if (token) {
        console.log('\n2. Testing Profile with token...');
        await testProfile(token);
    }
    
    console.log('\n3. Testing Login with Student ID...');
    const loginToken = await testLogin();
    
    if (loginToken) {
        console.log('\n4. Testing Profile with login token...');
        await testProfile(loginToken);
    }
    
    console.log('\n5. Testing Forgot Password...');
    const resetToken = await testForgotPassword();
    
    if (resetToken) {
        console.log('\n6. Testing Reset Password...');
        await testResetPassword(resetToken);
    }
    
    console.log('\n7. Testing Logout...');
    await testLogout();
}

// Install axios if not available
// npm install axios

runTests().catch(console.error); 