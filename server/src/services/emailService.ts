/**
 * Node modules
 */
import nodemailer from 'nodemailer';

/**
 * Utils
 */
import { InternalServerException } from '../utils/errors';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Check if email credentials are configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.isConfigured = true;
    } else {
      console.warn('⚠️  Email service not configured: Missing SMTP_USER or SMTP_PASS environment variables');
      this.isConfigured = false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    if (!this.isConfigured || !this.transporter) {
      console.error('❌ Email service not configured. Cannot send password reset email.');
      throw new InternalServerException('Email service is not configured. Please contact administrator.');
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Monito Store" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Monito Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #003459; margin: 0;">Monito Store</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #003459; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #666; line-height: 1.6;">
              You have requested to reset your password for your Monito Store account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #003459; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #003459; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px; margin-top: 30px;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2025 Monito Store. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new InternalServerException('Failed to send password reset email');
    }
  }

  async verifyConnection() {
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email service not configured - skipping verification');
      return;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
    }
  }

  isEmailServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const emailService = new EmailService();
