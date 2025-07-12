# Password Reset Feature Implementation Guide

## Overview
The password reset feature has been successfully implemented for the Monito Store application. This feature allows users to reset their forgotten passwords through email verification.

## Flow Description

### 1. Forgot Password Request
- User clicks "Forgot your password?" link on the login page
- A modal opens asking for their email address
- System validates if the email exists in the database
- If valid, a password reset email is sent to the user
- User receives confirmation that the email has been sent

### 2. Password Reset Email
- User receives an email with a secure reset link
- The link contains a unique token that expires in 1 hour
- Email includes both a button and a plain text link for accessibility

### 3. Password Reset Process
- User clicks the link in the email
- They are redirected to the reset password page
- User enters their new password and confirmation
- System validates the token and updates the password
- User is redirected to login page with success message

## Implementation Details

### Server-Side Changes

#### 1. Database Model Updates (`userModel.ts`)
```typescript
// Added fields to UserDocument interface and schema
resetPasswordToken?: string;
resetPasswordExpires?: Date;
```

#### 2. Email Service (`emailService.ts`)
- New service using Nodemailer for sending emails
- HTML email template with branded styling
- SMTP configuration for Gmail (configurable)

#### 3. Auth Service Updates (`authService.ts`)
- `forgotPassword(email)` - Generates reset token and sends email
- `resetPassword(token, newPassword)` - Validates token and updates password

#### 4. API Routes (`authRoute.ts`)
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### 5. Validation Schemas (`authValidation.ts`)
- `forgotPasswordSchema` - Validates email format
- `resetPasswordSchema` - Validates token and password match

### Client-Side Changes

#### 1. New Components
- `ForgotPasswordModal.tsx` - Modal for email input
- `ResetPasswordPage.tsx` - Full page for password reset

#### 2. Updated Components
- `LoginPage.tsx` - Added forgot password link and modal integration

#### 3. Service Updates (`authService.ts`)
- `forgotPassword(data)` - API call for forgot password
- `resetPassword(data)` - API call for reset password

#### 4. Routing Updates (`AppRoutes.tsx`)
- Added `/reset-password` route for the reset password page

## Environment Configuration

### Required Environment Variables (.env)
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""

# Frontend URL for reset links
CLIENT_URL=http://localhost:5173
```

### Gmail Setup Instructions
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password as `SMTP_PASS`

## Security Features

### 1. Token Security
- Cryptographically secure random tokens (32 bytes)
- Tokens expire after 1 hour
- Tokens are single-use and cleared after password reset

### 2. Email Validation
- Only sends emails to registered users
- Generic success message to prevent email enumeration

### 3. Password Validation
- Minimum password length requirements
- Password confirmation matching
- Secure password hashing with bcrypt

## Usage Instructions

### For Users
1. On login page, click "Forgot your password?"
2. Enter your registered email address
3. Check your email for the reset link
4. Click the link and enter your new password
5. Return to login with your new credentials

### For Developers
1. Configure email settings in `.env` file
2. Ensure all dependencies are installed (`nodemailer`, `@types/nodemailer`)
3. Test email functionality with a valid SMTP configuration
4. Monitor server logs for email service connection status

## Testing the Feature

### 1. Test Forgot Password Flow
```bash
# Test the forgot password endpoint
POST /api/auth/forgot-password
{
  "email": "test@example.com"
}
```

### 2. Test Reset Password Flow
```bash
# Test the reset password endpoint
POST /api/auth/reset-password
{
  "token": "generated_reset_token",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### 3. Manual Testing Steps
1. Register a test user
2. Navigate to login page
3. Click "Forgot your password?"
4. Enter the test user's email
5. Check email for reset link
6. Follow the link and reset password
7. Login with new password

## Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP credentials and Gmail app password
2. **Token expired**: Tokens expire in 1 hour, request a new reset
3. **Invalid token**: Ensure the full URL is copied correctly
4. **Password validation**: Check password meets minimum requirements

### Error Codes
- `AUTH_USER_NOT_FOUND`: Email not registered in system
- `INVALID_RESET_TOKEN`: Token is invalid or expired
- `VALIDATION_ERROR`: Input validation failed

## Dependencies Added
- `nodemailer`: Email sending functionality
- `@types/nodemailer`: TypeScript definitions for nodemailer

The password reset feature is now fully functional and ready for production use!
