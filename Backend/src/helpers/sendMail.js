"use strict"

const nodemailer = require('nodemailer')

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Transporter verification error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

module.exports = async function(to, subject, message) {
    try {
        console.log('Attempting to send email to:', to);
        console.log('Using email account:', process.env.EMAIL_USER);

        // Send mail with improved headers
        const info = await transporter.sendMail({
            from: {
                name: 'Doctor Appointment System',
                address: process.env.EMAIL_USER
            },
            to: to,
            subject: subject,
            html: message,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'X-Mailer': 'Doctor Appointment System'
            }
        })

        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return true
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response
        });
        return false
    }
}