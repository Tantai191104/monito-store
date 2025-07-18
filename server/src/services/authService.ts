/**
 * Node modules
 */
import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Types
 */
import { LoginPayload, RegisterPayload } from '../types/user';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Utils
 */
import { BadRequestException, NotFoundException, UnauthorizedException } from '../utils/errors';
import { generateTokens, verifyToken } from '../utils/jwt';
import { ERROR_CODE_ENUM } from '../constants';

/**
 * Services
 */
import { emailService } from './emailService';

export const authService = {
  async register({ name, email, password }: RegisterPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const existingUser = await UserModel.exists({ email }).session(session);

        if (existingUser) {
          throw new BadRequestException('Email already exists!', ERROR_CODE_ENUM.AUTH_EMAIL_ALREADY_EXISTS);
        }

        const newUser = new UserModel({
          email,
          name,
          password,
        });

        await newUser.save({ session });
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
  async login({ email, password }: LoginPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findOne({ email }).session(session);

        if (!user) {
          throw new NotFoundException('User not found', 'AUTH_USER_NOT_FOUND');
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
          throw new BadRequestException(
            'Invalid credentials',
            'INVALID_CREDENTIALS',
          );
        }

        const tokens = generateTokens({ userId: user._id as string, role: user.role });

        user.lastLogin = new Date();

        await user.save({ session });

        return {
          user,
          tokens,
        };
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      );

      const user = await UserModel.findById(decoded.userId);
      
      if (!user) {
        throw new UnauthorizedException(
          'User not found',
          'AUTH_USER_NOT_FOUND',
        );
      }

      const tokens = generateTokens({ userId: user._id as string, role: user.role });

      return tokens;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token expired',
          'TOKEN_EXPIRED',
        );
      }
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Invalid refresh token',
          'INVALID_TOKEN',
        );
      }
      throw error;
    }
  },
  async forgotPassword(email: string) {
    // Check if email service is configured
    if (!emailService.isEmailServiceConfigured()) {
      throw new BadRequestException(
        'Email service is not configured. Please contact administrator.',
        ERROR_CODE_ENUM.INTERNAL_SERVER_ERROR,
      );
    }

    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findOne({ email }).session(session);

        if (!user) {
          throw new NotFoundException('User not found', ERROR_CODE_ENUM.AUTH_USER_NOT_FOUND);
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save({ session });

        // Send email
        await emailService.sendPasswordResetEmail(email, resetToken);

        return { message: 'Password reset email sent successfully' };
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
  async resetPassword(token: string, newPassword: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: new Date() },
        }).session(session);

        if (!user) {
          throw new BadRequestException(
            'Invalid or expired reset token',
            ERROR_CODE_ENUM.INVALID_RESET_TOKEN,
          );
        }

        // Check if new password is same as current password
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
          throw new BadRequestException(
            'New password must be different from your current password',
            ERROR_CODE_ENUM.PASSWORD_SAME_AS_CURRENT,
          );
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ session });

        return { message: 'Password reset successfully' };
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};
