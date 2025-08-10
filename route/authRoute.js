// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const LoginOTP = require('../models/loginOTP'); // Assuming your model is here
const { sendOTPEmail } = require('../services/emailService'); // Assuming your email service is here

const router = express.Router();

// Apply rate limiting to prevent abuse
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 OTP requests per window
    message: { success: false, message: 'Too many OTP requests from this IP, please try again after 5 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

const verifyLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 verification attempts per window
    message: { success: false, message: 'Too many login attempts from this IP, please try again after 5 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- Send OTP Route ---
router.post(
    '/send-login-otp',
    otpLimiter,
    body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { email } = req.body;
            const otp = crypto.randomInt(100000, 999999).toString();

            await LoginOTP.findOneAndUpdate(
                { email },
                { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await sendOTPEmail(email, otp);

            res.json({ success: true, message: 'OTP sent successfully to your email.' });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, message: 'An internal error occurred while sending the OTP.' });
        }
    }
);

// --- Verify OTP Route ---
router.post(
    '/verify-login-otp',
    verifyLimiter,
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Invalid format for email or OTP.' });
        }

        try {
            const { email, otp } = req.body;
            const otpRecord = await LoginOTP.findOne({ email, otp });

            if (!otpRecord || otpRecord.expiresAt < new Date()) {
                return res.status(400).json({ success: false, message: 'The OTP is invalid or has expired.' });
            }

            await LoginOTP.findByIdAndDelete(otpRecord._id);

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ success: true, message: 'Login successful!', token });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).json({ success: false, message: 'An internal error occurred during verification.' });
        }
    }
);

module.exports = router;