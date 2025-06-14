"use strict"


// Auth Controller:

const Admin = require('../models/admin')
const Doctor = require('../models/doctor')
const Patient = require('../models/patient')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')
const sendMail = require('../helpers/sendMail')

module.exports = {

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send({
                    error: true,
                    message: "Email and password are required."
                });
            }

            // Try to find user in Admin, Doctor, Patient
            let user = await Admin.findOne({ email });
            let userType = 'admin';
            if (!user) {
                user = await Doctor.findOne({ email });
                userType = 'doctor';
            }
            if (!user) {
                user = await Patient.findOne({ email });
                userType = 'patient';
            }
            if (!user) {
                return res.status(401).send({
                    error: true,
                    message: "Email or password is incorrect."
                });
            }

            // Check password
            const encrypted = passwordEncrypt(password);
            console.log("Login: entered password (hashed):", encrypted);
            console.log("Login: stored password:", user.password);
            if (user.password !== encrypted) {
                return res.status(401).send({
                    error: true,
                    message: "Email or password is incorrect."
                });
            }

            // Check if user is active (missing in current version)
            if (!user.isActive) {
                return res.status(401).send({
                    error: true,
                    message: "This account is not active."
                });
            }

            // جلب أو إنشاء التوكن
            let tokenData = await Token.findOne({ userId: user._id });
            if (!tokenData) {
                tokenData = await Token.create({
                    userId: user._id,
                    token: passwordEncrypt(user._id + Date.now()),
                    userType
                });
            }

            // أرسل الرد مع key
           // أرسل الرد مع key - إرسال كامل بيانات المستخدم مثل النسخة القديمة
    res.send({
        error: false,
        key: tokenData.token,
        user,           // إرسال كامل بيانات المستخدم
        userType
    });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send({
                error: true,
                message: "An error occurred during login. Please try again later."
            });
        }
    },
    register: async (req, res) => {
        console.log("Register endpoint reached!");

        const {email} = req.body

        if(req.body.branch){
            try {
                await Doctor.create(req.body)
                req.body.userType="doctor"
                const doctor = await Doctor.findOne({email})

                let tokenData = await Token.findOne({ userId: doctor._id })
                if (!tokenData) tokenData = await Token.create({
                    userId: doctor._id,
                    token: passwordEncrypt(doctor._id + Date.now()),
                    userType : 'doctor'
                })

                res.send({
                    error: false,
                    key: tokenData.token,
                    doctor,
                    userType : 'doctor'
                })
            } catch (error) {
                console.error("Error during doctor registration:", error);
                res.errorStatusCode = 500;
                throw new Error("Doctor registration failed.");
            }
        }
        else if(req.body.username){
            try {
                await Admin.create(req.body)
                req.body.userType="admin"
                const admin = await Admin.findOne({email})
             
                let tokenData = await Token.findOne({ userId: admin._id })
                if (!tokenData) tokenData = await Token.create({
                    userId: admin._id,
                    token: passwordEncrypt(admin._id + Date.now()),
                    userType : 'admin'
                })

                res.send({
                    error: false,
                    key: tokenData.token,
                    admin,
                    userType : 'admin'
                })
            } catch (error) {
                console.error("Error during admin registration:", error);
                res.errorStatusCode = 500;
                throw new Error("Admin registration failed.");
            }
        }
        else{
            try {
                await Patient.create(req.body)
                req.body.userType="patient"
                const patient = await Patient.findOne({email})

                let tokenData = await Token.findOne({ userId: patient._id })
                if (!tokenData) tokenData = await Token.create({
                    userId: patient._id,
                    token: passwordEncrypt(patient._id + Date.now()),
                    userType : 'patient'
                })

                res.send({
                    error: false,
                    key: tokenData.token,
                    patient,
                    userType : 'patient'
                })
            } catch (error) {
                console.error("Error during patient registration:", error);
                res.errorStatusCode = 500;
                throw new Error("Patient registration failed.");
            }
        }
    },


    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "simpleToken: Logout"
            #swagger.description = 'Delete token key.'
        */

        const auth = req.headers?.authorization || null // Token ...tokenKey... 
        const tokenKey = auth ? auth.split(' ') : null // ['Token', '...tokenKey...'] 

        let message = null, result = {}

        if (tokenKey) {

            if (tokenKey[0] == 'Token') { // SimpleToken

                result = await Token.deleteOne({ token: tokenKey[1] })
                message = 'Token deleted. Logout was OK.'

            } 
        }

        res.send({
            error: false,
            message,
            result
        })
    },

    changePassword: async (req, res) => {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            console.log('Received in changePassword:', { userId, oldPassword, newPassword });

            // ابحث عن المستخدم في جميع الجداول
            let user = await Admin.findById(userId) || await Doctor.findById(userId) || await Patient.findById(userId);
            console.log('User found:', !!user);

            if (!user) {
                res.errorStatusCode = 404;
                throw new Error('User not found.');
            }
            if (user.password !== passwordEncrypt(oldPassword)) {
                res.errorStatusCode = 401;
                throw new Error('Old password is incorrect.');
            }
            user.password = newPassword;
            await user.save();
            res.send({ error: false, message: 'Password changed successfully.' });
        } catch (err) {
            console.error('Error in changePassword:', err);
            res.status(res.errorStatusCode || 500).send({ error: true, message: err.message });
        }
    },

    forgotPassword: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Forgot Password"
            #swagger.description = 'Send reset password email'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "email": "test@example.com"
                }
            }
        */

        const { email } = req.body;

        if (!email) {
            return res.status(400).send({
                error: true,
                message: "Email is required"
            });
        }

        try {
            console.log("Searching for user with email:", email);

            // Check if user exists
            let user = await Admin.findOne({ email });
            let userType = 'admin';
            let Model = Admin;
            
            if (!user) {
                console.log("User not found in Admin, checking Doctor...");
                user = await Doctor.findOne({ email });
                userType = 'doctor';
                Model = Doctor;
            }
            if (!user) {
                console.log("User not found in Doctor, checking Patient...");
                user = await Patient.findOne({ email });
                userType = 'patient';
                Model = Patient;
            }

            if (!user) {
                console.log("No user found with email:", email);
                return res.status(404).send({
                    error: true,
                    message: "No user found with this email address"
                });
            }

            console.log("User found:", userType);

            // Generate reset token
            const resetToken = passwordEncrypt(user._id + Date.now());
            console.log("Reset token generated");
            
            // Update reset token using findOneAndUpdate to avoid validation
            try {
                await Model.findOneAndUpdate(
                    { _id: user._id },
                    { 
                        resetToken: resetToken,
                        resetTokenExpires: Date.now() + 3600000 // Token expires in 1 hour
                    },
                    { new: true, runValidators: false }
                );
                console.log("Reset token saved to user");

                // Send reset password email
                const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
                const emailMessage = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h1 style="color: #2c3e50;">Doctor Appointment System</h1>
                        </div>
                        <p style="color: #34495e; font-size: 16px;">Dear ${user.firstName || 'User'},</p>
                        <p style="color: #34495e; font-size: 16px;">A password reset was requested for your account. To proceed with the password reset, please click the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
                        </div>
                        <p style="color: #7f8c8d; font-size: 14px;">For security reasons, this link will expire in 1 hour.</p>
                        <p style="color: #7f8c8d; font-size: 14px;">If you did not request this password reset, please ignore this email or contact our support team if you have any concerns.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <div style="color: #95a5a6; font-size: 12px; text-align: center;">
                            <p>This is an automated message from Doctor Appointment System.</p>
                            <p>Please do not reply to this email.</p>
                            <p>For support, contact: support@doctorappointment.com</p>
                        </div>
                    </div>
                `;

                console.log("Reset URL:", resetUrl);
                console.log("Attempting to send reset password email...");
                const emailSent = await sendMail(
                    email,
                    'Password Reset Request',
                    emailMessage
                );

                if (!emailSent) {
                    console.error("Failed to send reset password email");
                    return res.status(500).send({
                        error: true,
                        message: "Failed to send reset password email"
                    });
                }

                console.log("Reset password email sent successfully");

            } catch (saveError) {
                console.error("Error saving reset token:", saveError);
                return res.status(500).send({
                    error: true,
                    message: "Error saving reset token",
                    details: saveError.message
                });
            }

            res.send({
                error: false,
                message: "Password reset instructions have been sent to your email"
            });

        } catch (error) {
            console.error("Error in forgot password:", error);
            res.status(500).send({
                error: true,
                message: "Error processing forgot password request",
                details: error.message
            });
        }
    },

    resetPassword: async (req, res) => {
        console.log("resetPassword called");
        const { token, newPassword } = req.body;
        console.log("token:", token, "newPassword:", newPassword);

        try {
            // Find user with valid reset token
            let user = await Admin.findOne({ 
                resetToken: token,
                resetTokenExpires: { $gt: Date.now() }
            });
            let Model = Admin;
            console.log("Checked Admin, found:", !!user);

            if (!user) {
                user = await Doctor.findOne({ 
                    resetToken: token,
                    resetTokenExpires: { $gt: Date.now() }
                });
                Model = Doctor;
                console.log("Checked Doctor, found:", !!user);
            }
            if (!user) {
                user = await Patient.findOne({ 
                    resetToken: token,
                    resetTokenExpires: { $gt: Date.now() }
                });
                Model = Patient;
                console.log("Checked Patient, found:", !!user);
            }

            if (!user) {
                console.log("No user found with valid reset token");
                return res.status(400).send({
                    error: true,
                    message: "Invalid or expired reset token"
                });
            }

            // Update password and clear reset token using updateOne
            console.log("Before encrypt");
            const encrypted = passwordEncrypt(newPassword);
            console.log("Reset: new password (hashed):", encrypted);
            try {
                const result = await Model.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: encrypted,
                            resetToken: undefined,
                            resetTokenExpires: undefined
                        }
                    }
                );
                console.log("Result of updateOne:", result);
                console.log("Password updated successfully for user id:", user._id);
            } catch (err) {
                console.error("Error during updateOne:", err);
                if (!res.headersSent) {
                    return res.status(500).send({
                        error: true,
                        message: "Error updating password",
                        details: err.message
                    });
                }
            }

            res.send({
                error: false,
                message: "Password has been reset successfully"
            });
            console.log("Response sent to client");

        } catch (error) {
            console.error("Error in reset password:", error);
            if (!res.headersSent) {
                res.status(500).send({
                    error: true,
                    message: "Error processing password reset",
                    details: error.message
                });
            }
        }
    },
}