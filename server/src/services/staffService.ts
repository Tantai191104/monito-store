/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreateStaffPayload, UpdateStaffPayload } from '../types/staff';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const staffService = {
  /**
   * Create new staff member
   */
  async createStaff(data: CreateStaffPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Check if email already exists
        const existingUser = await UserModel.findOne({
          email: data.email,
        }).session(session);

        if (existingUser) {
          throw new BadRequestException('Email already exists');
        }

        const newStaff = new UserModel({
          ...data,
          role: 'staff',
          joinDate: new Date(),
        });

        await newStaff.save({ session });
        return newStaff;
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        if (duplicateField === 'email') {
          throw new BadRequestException('Email already exists');
        } else if (duplicateField === 'name') {
          throw new BadRequestException('Username already exists');
        }
        throw new BadRequestException('User already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all staff members with filters
   */
  async getStaff(
    filters: {
      department?: string;
      status?: 'active' | 'inactive';
      search?: string;
    } = {},
  ) {
    const query: any = { role: 'staff' };

    // Apply filters
    if (filters.department) {
      query.department = filters.department;
    }

    if (filters.status) {
      query.isActive = filters.status === 'active';
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { department: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const staff = await UserModel.find(query)
      .select('-password')
      .sort({ joinDate: -1 });

    return staff;
  },

  /**
   * Get staff member by ID
   */
  async getStaffById(staffId: string) {
    const staff = await UserModel.findOne({
      _id: staffId,
      role: 'staff',
    }).select('-password');

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  },

  /**
   * Update staff member
   */
  async updateStaff(staffId: string, data: UpdateStaffPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const staff = await UserModel.findOne({
          _id: staffId,
          role: 'staff',
        }).session(session);

        if (!staff) {
          throw new NotFoundException('Staff member not found');
        }

        // Update fields
        Object.assign(staff, data);
        await staff.save({ session });

        return staff;
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        if (duplicateField === 'email') {
          throw new BadRequestException('Email already exists');
        } else if (duplicateField === 'name') {
          throw new BadRequestException('Username already exists');
        }
        throw new BadRequestException('User already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete staff member (soft delete by deactivating)
   */
  async deleteStaff(staffId: string) {
    const staff = await UserModel.findOne({
      _id: staffId,
      role: 'staff',
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Soft delete by deactivating
    staff.isActive = false;
    await staff.save();

    return { deletedStaff: staff };
  },

  /**
   * Update staff permissions
   */
  async updatePermissions(staffId: string, permissions: string[]) {
    const staff = await UserModel.findOne({
      _id: staffId,
      role: 'staff',
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    staff.permissions = permissions;
    await staff.save();

    return staff;
  },

  /**
   * Get staff statistics
   */
  async getStaffStats() {
    const stats = await UserModel.aggregate([
      { $match: { role: 'staff' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          byDepartment: {
            $push: {
              department: '$department',
              isActive: '$isActive',
            },
          },
        },
      },
    ]);

    const departmentStats = await UserModel.aggregate([
      { $match: { role: 'staff' } },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
        },
      },
    ]);

    return {
      total: stats[0]?.total || 0,
      active: stats[0]?.active || 0,
      inactive: stats[0]?.inactive || 0,
      departments: departmentStats,
    };
  },
};
