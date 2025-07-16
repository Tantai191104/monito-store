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
import { ERROR_CODE_ENUM } from '../constants';

export const staffService = {
  /**
   * Create new staff member
   */
  async createStaff(data: CreateStaffPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // ✅ Step 1: Check for existing email
        const existingEmail = await UserModel.findOne({
          email: data.email,
        }).session(session);
        if (existingEmail) {
          throw new BadRequestException(
            'Email already exists',
            ERROR_CODE_ENUM.AUTH_EMAIL_ALREADY_EXISTS,
          );
        }

        // ✅ Step 2: Check for existing name
        const existingName = await UserModel.findOne({
          name: data.name,
        }).session(session);
        if (existingName) {
          throw new BadRequestException(
            'Staff name already exists',
            ERROR_CODE_ENUM.STAFF_NAME_ALREADY_EXISTS,
          );
        }

        // ✅ Step 3: Check for existing phone
        const existingPhone = await UserModel.findOne({
          phone: data.phone,
        }).session(session);
        if (existingPhone) {
          throw new BadRequestException(
            'Phone number already exists',
            ERROR_CODE_ENUM.STAFF_PHONE_ALREADY_EXISTS,
          );
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
          throw new BadRequestException(
            'Email already exists',
            ERROR_CODE_ENUM.AUTH_EMAIL_ALREADY_EXISTS,
          );
        } else if (duplicateField === 'name') {
          throw new BadRequestException(
            'Username already exists',
            ERROR_CODE_ENUM.STAFF_NAME_ALREADY_EXISTS,
          );
        } else if (duplicateField === 'phone') {
          throw new BadRequestException(
            'Phone number already exists',
            ERROR_CODE_ENUM.STAFF_PHONE_ALREADY_EXISTS,
          );
        }
        throw new BadRequestException(
          'A user with the same information already exists.',
          ERROR_CODE_ENUM.RESOURCE_CONFLICT,
        );
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
    const query: any = { role: 'staff', deletedAt: null };

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
      .sort({ createdAt: -1 });

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

        if (data.email && data.email !== staff.email) {
          const existingUser = await UserModel.findOne({
            email: data.email,
          }).session(session);
          if (existingUser) {
            throw new BadRequestException(
              'Email already exists',
              ERROR_CODE_ENUM.AUTH_EMAIL_ALREADY_EXISTS,
            );
          }
        }
        if (data.name && data.name !== staff.name) {
          const existingUser = await UserModel.findOne({
            name: data.name,
          }).session(session);
          if (existingUser) {
            throw new BadRequestException(
              'Staff name already exists',
              ERROR_CODE_ENUM.STAFF_NAME_ALREADY_EXISTS,
            );
          }
        }
        if (data.phone && data.phone !== staff.phone) {
          const existingUser = await UserModel.findOne({
            phone: data.phone,
          }).session(session);
          if (existingUser) {
            throw new BadRequestException(
              'Phone number already exists',
              ERROR_CODE_ENUM.STAFF_PHONE_ALREADY_EXISTS,
            );
          }
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
          throw new BadRequestException(
            'Email already exists',
            ERROR_CODE_ENUM.AUTH_EMAIL_ALREADY_EXISTS,
          );
        } else if (duplicateField === 'name') {
          throw new BadRequestException(
            'Staff name already exists',
            ERROR_CODE_ENUM.STAFF_NAME_ALREADY_EXISTS,
          );
        } else if (duplicateField === 'phone') {
          throw new BadRequestException(
            'Phone number already exists',
            ERROR_CODE_ENUM.STAFF_PHONE_ALREADY_EXISTS,
          );
        }
        throw new BadRequestException(
          'A user with the same information already exists.',
          ERROR_CODE_ENUM.RESOURCE_CONFLICT,
        );
      }
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete staff member (soft delete by setting deletedAt)
   */
  async deleteStaff(staffId: string) {
    const staff = await UserModel.findOne({
      _id: staffId,
      role: 'staff',
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Soft delete by setting the deletedAt timestamp
    staff.deletedAt = new Date();
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

    (staff as any).permissions = permissions;
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
