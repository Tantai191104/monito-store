/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreateColorPayload, UpdateColorPayload } from '../types/color';

/**
 * Models
 */
import ColorModel from '../models/colorModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const colorService = {
  /**
   * Create new color
   */
  async createColor(data: CreateColorPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const newColor = new ColorModel(data);

        await newColor.save({ session });
        return newColor;
      });
    } catch (error: any) {
      if (error.code === 11000) {
        // Check which field caused the duplicate
        const duplicateField = Object.keys(error.keyPattern)[0];
        if (duplicateField === 'name') {
          throw new BadRequestException('Color name already exists');
        } else if (duplicateField === 'hexCode') {
          throw new BadRequestException('Hex code already exists');
        }
        throw new BadRequestException('Color already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all colors
   */
  async getColors() {
    const colors = await ColorModel.find().sort({ name: 1 });
    return colors;
  },

  /**
   * Get color by ID
   */
  async getColorById(colorId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  },

  /**
   * Update color
   */
  async updateColor(colorId: string, data: UpdateColorPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const color = await ColorModel.findById(colorId).session(session);

        if (!color) {
          throw new NotFoundException('Color not found');
        }

        // Use $set to only update provided fields
        const updatedColor = await ColorModel.findByIdAndUpdate(
          colorId,
          { $set: data },
          {
            new: true,
            runValidators: true,
            session,
          },
        );

        return updatedColor;
      });
    } catch (error: any) {
      if (error.code === 11000) {
        // Check which field caused the duplicate
        const duplicateField = Object.keys(error.keyPattern)[0];
        if (duplicateField === 'name') {
          throw new BadRequestException('Color name already exists');
        } else if (duplicateField === 'hexCode') {
          throw new BadRequestException('Hex code already exists');
        }
        throw new BadRequestException('Color already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete color
   */
  async deleteColor(colorId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const color = await ColorModel.findById(colorId).session(session);

        if (!color) {
          throw new NotFoundException('Color not found');
        }

        await ColorModel.findByIdAndDelete(colorId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};
