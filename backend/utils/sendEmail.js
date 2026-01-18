const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // defaults to Ethereal if env vars not set (for testing)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || 'test@ethereal.email',
            pass: process.env.SMTP_PASSWORD || 'testpassword',
        },
    });

    const mailOptions = {
        from: 'Swift Basket <noreply@swiftbasket.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email send failed:', error);
        // Don't throw error to avoid blocking valid order process
    }
};

module.exports = sendEmail;
