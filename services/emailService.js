const nodemailer = require('nodemailer');

// Create transporter
const createTransport = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
const sendOTPEmail = async (email, studentId, otp) => {
    try {
        const transporter = createTransport();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'IEEE Backend - Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">IEEE Backend</h1>
                            <p style="color: #7f8c8d; margin: 10px 0;">Email Verification</p>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <h2 style="color: #34495e; margin-bottom: 15px;">Hello!</h2>
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 15px;">
                                Thank you for registering with IEEE Backend. To complete your registration, 
                                please use the verification code below:
                            </p>
                        </div>
                        
                        <div style="background-color: #3498db; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                            <h3 style="margin: 0; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
                            <p style="margin: 10px 0 0 0; font-size: 14px;">Your verification code</p>
                        </div>
                        
                        <div style="margin: 25px 0;">
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 10px;">
                                <strong>Student ID:</strong> ${studentId}
                            </p>
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 10px;">
                                <strong>Email:</strong> ${email}
                            </p>
                        </div>
                        
                        <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 25px 0;">
                            <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                                <strong>Important:</strong> This code will expire in 10 minutes. 
                                If you didn't request this verification, please ignore this email.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                            <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                                © 2024 IEEE Backend. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};



// Send welcome email
const sendWelcomeEmail = async (email, studentId) => {
    try {
        const transporter = createTransport();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to IEEE Backend!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">IEEE Backend</h1>
                            <p style="color: #7f8c8d; margin: 10px 0;">Welcome!</p>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <h2 style="color: #34495e; margin-bottom: 15px;">Welcome!</h2>
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 15px;">
                                Thank you for successfully registering with IEEE Backend. Your account has been created and verified.
                            </p>
                        </div>
                        
                        <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                            <h3 style="margin: 0; font-size: 18px;">Account Verified Successfully!</h3>
                            <p style="margin: 10px 0 0 0; font-size: 14px;">You can now log in to your account</p>
                        </div>
                        
                        <div style="margin: 25px 0;">
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 10px;">
                                <strong>Student ID:</strong> ${studentId}
                            </p>
                            <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 10px;">
                                <strong>Email:</strong> ${email}
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                            <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                                © 2024 IEEE Backend. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Welcome email sending failed:', error);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
}; 