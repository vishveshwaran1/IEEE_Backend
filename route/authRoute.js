const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});

// Send OTP for direct login
router.post('/send-login-otp', async (req, res) => {
    try {
        console.log('Send login OTP request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }
        
        const { studentId, email } = req.body;

        // Validate required fields
        if (!studentId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and Email are required'
            });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Find or create user
        let user = await User.findOne({ studentId, email });
        
        if (!user) {
            // Create new user for direct login
            user = new User({
                studentId,
                email,
                isEmailVerified: false,
                isActive: true
            });
        }

        // Generate OTP
        await user.generateOTP();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, studentId, user.emailVerificationOTP.code);
        
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }
        
        res.json({
            success: true,
            message: 'OTP sent successfully to your email',
            otp: process.env.NODE_ENV === 'development' ? user.emailVerificationOTP.code : undefined,
            expiresIn: '10 minutes'
        });

    } catch (error) {
        console.error('Send login OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
});

// Verify OTP and login
router.post('/verify-login-otp', async (req, res) => {
    try {
        console.log('Verify login OTP request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }
        
        const { studentId, email, otp } = req.body;

        if (!studentId || !email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Student ID, Email, and OTP are required'
            });
        }

        // Find user
        const user = await User.findOne({ studentId, email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if OTP is expired
        if (user.isOTPExpired()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new OTP'
            });
        }

        // Check verification attempts
        if (user.verificationAttempts >= 3) {
            const timeDiff = Date.now() - user.lastVerificationAttempt.getTime();
            if (timeDiff < 15 * 60 * 1000) { // 15 minutes cooldown
                return res.status(400).json({
                    success: false,
                    message: 'Too many verification attempts. Please try again in 15 minutes'
                });
            } else {
                user.verificationAttempts = 0;
                await user.save();
            }
        }

        // Verify OTP
        const isValid = await user.verifyOTP(otp);

        if (isValid) {
            // Update last login
            await user.updateLastLogin();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, studentId: user.studentId, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
                    token,
                    isAuthenticated: true
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again'
            });
        }

    } catch (error) {
        console.error('Verify login OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message
        });
    }
});

// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toJSON()
            }
        });

    } catch (error) {
        console.error('Profile access error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to access profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { email } = req.body;

        // Update user fields - only email can be updated

        // // Check if email is being changed
        // if (email && email !== user.email) {
        //     // Check if new email already exists
        //     const existingUser = await User.findOne({ email });
        //     if (existingUser) {
        //         return res.status(400).json({
        //             success: false,
        //             message: 'Email already exists'
        //         });
        //     }
        //     user.email = email;
        //     user.isEmailVerified = false; // Require re-verification
        // }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.toJSON()
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // by removing the token. This endpoint can be used for logging.
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to logout',
            error: error.message
        });
    }
});

module.exports = router;
