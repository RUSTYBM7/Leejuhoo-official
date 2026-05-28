import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Rate limiting - 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input helper
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000);
};

// POST /api/confirm-role - Send role confirmation email
app.post('/api/confirm-role', limiter, async (req, res) => {
  try {
    const { name, email, role, message } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        error: 'Name, email, and role are required.'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format.'
      });
    }

    // Validate role
    const validRoles = [
      'Editor-in-Chief',
      'Personal Manager',
      'Event Management Lead',
      'Fan Relations Manager'
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role selected.'
      });
    }

    // Prepare email content
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message || '');

    const mailOptions = {
      from: `"Lee Juhoo Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `🎉 Role Confirmation: ${sanitizedName} accepts ${role}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">🎵 Lee Juhoo Official</h1>
            <p style="color: #f0f0f0; text-align: center; margin: 10px 0 0;">Role Confirmation Request</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Role Acceptance Confirmation</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${sanitizedName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Accepted Role:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #667eea; font-weight: bold;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
              </tr>
            </table>

            ${sanitizedMessage ? `
              <div style="margin-top: 20px;">
                <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; color: #333;">${sanitizedMessage}</p>
              </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px;">
              <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                ✅ This is an automated confirmation from the Lee Juhoo official website.
                Please respond to this email to confirm the role assignment.
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Lee Juhoo Official. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        LEE JOOHOO OFFICIAL - ROLE CONFIRMATION

        Name: ${sanitizedName}
        Email: ${email}
        Accepted Role: ${role}
        Date: ${new Date().toLocaleString()}

        Message: ${sanitizedMessage || 'No message provided'}

        Please respond to this email to confirm the role assignment.
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Role confirmation email sent for ${sanitizedName} - ${role}`);

    res.status(200).json({
      success: true,
      message: 'Your role confirmation has been sent successfully! The team will respond shortly.'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      error: 'Failed to send confirmation. Please try again or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎵 Lee Juhoo Server running on port ${PORT}`);
  console.log(`📧 Email configured for: ${process.env.GMAIL_USER}`);
});
