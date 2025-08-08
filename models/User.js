const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true,
        minlength: [5, 'Student ID must be at least 5 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    // No name field needed - only studentId and email
    // username field removed - not needed for passwordless system
    role: {
        type: String,
        enum: ['student', 'admin', 'faculty'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: {
        code: String,
        expiresAt: Date
    },
    lastLogin: {
        type: Date
    },
    verificationAttempts: {
        type: Number,
        default: 0
    },
    lastVerificationAttempt: Date
}, {
    timestamps: true
});

// Method to get user without sensitive data
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.emailVerificationOTP;
    return user;
};

// Method to update last login
UserSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Method to generate OTP
UserSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailVerificationOTP = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    return this.save();
};

// Method to verify OTP
UserSchema.methods.verifyOTP = function(otp) {
    if (!this.emailVerificationOTP || !this.emailVerificationOTP.code) {
        return false;
    }
    
    if (new Date() > this.emailVerificationOTP.expiresAt) {
        this.emailVerificationOTP = undefined;
        this.save();
        return false;
    }
    
    if (this.emailVerificationOTP.code === otp) {
        this.isEmailVerified = true;
        this.emailVerificationOTP = undefined;
        this.verificationAttempts = 0;
        return this.save().then(() => true);
    }
    
    this.verificationAttempts += 1;
    this.lastVerificationAttempt = new Date();
    return this.save().then(() => false);
};

// Method to check if OTP is expired
UserSchema.methods.isOTPExpired = function() {
    if (!this.emailVerificationOTP || !this.emailVerificationOTP.expiresAt) {
        return true;
    }
    return new Date() > this.emailVerificationOTP.expiresAt;
};

module.exports = mongoose.model('User', UserSchema); 