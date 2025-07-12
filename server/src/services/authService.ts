/**
 * Node modules
 */
import mongoose from 'mongoose';

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

        const tokens = generateTokens({ userId: user._id as string, tokenVersion: user.tokenVersion });

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

      const tokens = generateTokens({ userId: user._id as string, tokenVersion: user.tokenVersion });

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
};
