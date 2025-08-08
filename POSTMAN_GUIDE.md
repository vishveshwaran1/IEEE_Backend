# Postman Testing Guide for IEEE Backend Authentication

## Setup Instructions

### 1. Base URL
```
http://localhost:5000/api
```

### 2. Headers
For all requests, add this header:
```
Content-Type: application/json
```

For authenticated requests, add:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Send Login OTP (Direct Login)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/send-login-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "studentId": "STU12345",
  "email": "student@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "otp": "123456",
  "expiresIn": "10 minutes"
}
```

---

## 2. Verify Login OTP and Login

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/verify-login-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "studentId": "STU12345",
  "email": "student@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "studentId": "STU12345",
      "email": "student@example.com",
      "role": "student",
      "isActive": true,
      "isEmailVerified": true,
      "lastLogin": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isAuthenticated": true
  }
}
```

---

## 3. Send OTP for Registration

---

## 2. Verify OTP

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/verify-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "studentId": "STU12345",
  "email": "student@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "_id": "...",
      "studentId": "STU12345",
      "email": "student@example.com",
      "isEmailVerified": true,
      "role": "student",
      "isActive": true
    }
  }
}
```

---

## 3. Complete Registration

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/complete-registration`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "studentId": "STU12345",
  "email": "student@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "user": {
      "_id": "...",
      "studentId": "STU12345",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 4. Register User (Legacy)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/register`

---

## 2. Login User

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "studentId": "STU12345",
  "password": "password123",
  "rememberMe": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "studentId": "STU12345",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "isActive": true,
      "lastLogin": "...",
      "rememberMe": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isAuthenticated": true
  }
}
```

---

## 3. Get User Profile

**Method:** `GET`  
**URL:** `http://localhost:5000/api/auth/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "studentId": "STU12345",
      "email": "student@example.com",
      "role": "student",
      "isActive": true,
      "lastLogin": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

## 4. Forgot Password

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "student@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email address",
  "resetToken": "abc123def456..." // Only in development mode
}
```

---

## 5. Reset Password

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "token": "abc123def456...",
  "newPassword": "newpassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

---

## 6. Logout

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Postman Collection Setup

### Step 1: Create a New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "IEEE Backend Authentication"

### Step 2: Create Environment Variables
1. Click "Environments" → "New"
2. Name it "IEEE Backend Local"
3. Add these variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (leave empty, will be set after login)

### Step 3: Create Requests

#### Request 1: Register
- Method: `POST`
- URL: `{{base_url}}/auth/register`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (use the register body above)

#### Request 2: Login
- Method: `POST`
- URL: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (use the login body above)
- **Test Script** (to automatically save token):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

#### Request 3: Get Profile
- Method: `GET`
- URL: `{{base_url}}/auth/profile`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`

#### Request 4: Forgot Password
- Method: `POST`
- URL: `{{base_url}}/auth/forgot-password`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (use the forgot password body above)

#### Request 5: Reset Password
- Method: `POST`
- URL: `{{base_url}}/auth/reset-password`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (use the reset password body above)

#### Request 6: Logout
- Method: `POST`
- URL: `{{base_url}}/auth/logout`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`

---

## Testing Flow

1. **Start the server:** `npm run dev`
2. **Test Register:** Create a new user
3. **Test Login:** Login and get token
4. **Test Profile:** Get user profile with token
5. **Test Forgot Password:** Request password reset
6. **Test Reset Password:** Reset password with token
7. **Test Logout:** Logout user

---

## Common Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "User with this email or Student ID already exists"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid Student ID or Password"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Login failed",
  "error": "Error details"
}
```

---

## Tips

1. **Save the token** from login response to use in other requests
2. **Use environment variables** for base URL and token
3. **Test error cases** by sending invalid data
4. **Check response status codes** and error messages
5. **Use the test script** to automatically save tokens 