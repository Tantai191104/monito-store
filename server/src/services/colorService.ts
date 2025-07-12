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
import PetModel from '../models/petModel'; // ✅ Import PetModel for constraint checking

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
   * Get all colors with pet count
   */
  async getColors() {
    const colors = await ColorModel.find().sort({ createdAt: -1 });

    // ✅ Calculate pet count for each color
    const colorsWithPetCount = await Promise.all(
      colors.map(async (color) => {
        const petCount = await PetModel.countDocuments({
          color: color._id,
        });

        return {
          ...color.toObject(),
          petCount,
        };
      }),
    );

    return colorsWithPetCount;
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

  // ✅ Update method - NO constraint for deactivate
  async updateColor(
    colorId: string,
    data: {
      name?: string;
      hexCode?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
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

        // ✅ NO constraint check here - allow deactivate even if pets exist
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

  // ✅ Delete method - STRICT constraint
  async deleteColor(colorId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    // ✅ Check if color is being used by any pets
    const petsUsingColor = await PetModel.countDocuments({
      color: colorId,
    });

    if (petsUsingColor > 0) {
      throw new BadRequestException(
        `Cannot delete color "${color.name}" because it is being used by ${petsUsingColor} pet(s). Please reassign or delete these pets first.`,
        'COLOR_IN_USE' as any,
      );
    }

    await ColorModel.findByIdAndDelete(colorId);
    return { deletedColor: color, affectedPets: 0 };
  },

  // ✅ New method for bulk delete with constraint checking
  async bulkDeleteColors(colorIds: string[]) {
    const results = {
      deleted: [] as any[],
      failed: [] as {
        colorId: string;
        colorName: string;
        reason: string;
        petCount: number;
      }[],
    };

    for (const colorId of colorIds) {
      try {
        const color = await ColorModel.findById(colorId);

        if (!color) {
          results.failed.push({
            colorId,
            colorName: 'Unknown',
            reason: 'Color not found',
            petCount: 0,
          });
          continue;
        }

        // Check if color is being used by any pets
        const petsUsingColor = await PetModel.countDocuments({
          color: colorId,
        });

        if (petsUsingColor > 0) {
          results.failed.push({
            colorId,
            colorName: color.name,
            reason: 'Color is being used by pets',
            petCount: petsUsingColor,
          });
          continue;
        }

        // Safe to delete
        await ColorModel.findByIdAndDelete(colorId);
        results.deleted.push(color);
      } catch (error: any) {
        results.failed.push({
          colorId,
          colorName: 'Unknown',
          reason: error.message || 'Unexpected error',
          petCount: 0,
        });
      }
    }

    return results;
  },

  // ✅ Utility method to get color usage statistics
  async getColorUsageStats(colorId: string) {
    const color = await ColorModel.findById(colorId);
    if (!color) {
      throw new NotFoundException('Color not found');
    }

    const petCount = await PetModel.countDocuments({
      color: colorId,
    });

    // Get sample pets for reference
    const samplePets = await PetModel.find({ color: colorId })
      .select('name _id')
      .limit(5);

    return {
      color,
      petCount,
      samplePets,
      canDelete: petCount === 0,
    };
  },
};
