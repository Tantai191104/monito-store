/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Utils
 */
import { NotFoundException } from '../utils/errors';

export const userService = {
  /**
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findById(userId).session(session);

        if (!user) {
          throw new NotFoundException('User not found');
        }
        
        return user;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  async updateProfile(userId: string, update: Partial<{ name: string; email: string; phone: string; department: string; position: string }>) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $set: update },
          { new: true, runValidators: true, session }
        );
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findById(userId).session(session);
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          throw new Error('Current password is incorrect');
        }
        if (await user.comparePassword(newPassword)) {
          throw new Error('New password must be different from the current password.');
        }
        user.password = newPassword;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save({ session });
        return user;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};
