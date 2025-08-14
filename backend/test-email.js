const { sendVerificationEmail } = require('./services/emailService');
require('dotenv').config();

// Test email sending
const testEmail = async () => {
  try {
    console.log('Testing email service...');
    console.log('SMTP Configuration:');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    console.log('From Email:', process.env.FROM_EMAIL);
    console.log('From Name:', process.env.FROM_NAME);
    console.log('Client URL:', process.env.CLIENT_URL);
    
    const testToken = 'test-verification-token-123';
    const result = await sendVerificationEmail(
      'test@example.com', // Replace with your test email
      'Test User',
      testToken
    );
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();