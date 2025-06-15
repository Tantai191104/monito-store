/**
 * Models
 */
import ColorModel from '../models/colorModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const colorService = {
  async createColor(data: {
    name: string;
    hexCode?: string;
    description?: string;
  }) {
    try {
      const newColor = new ColorModel(data);

      await newColor.save();
      return newColor;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Color name already exists');
      }
      throw error;
    }
  },

  async getColors() {
    const colors = await ColorModel.find().sort({ name: 1 });

    return colors;
  },

  async getColorById(colorId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  },

  async updateColor(
    colorId: string,
    data: {
      name?: string;
      hexCode?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const color = await ColorModel.findById(colorId);

      if (!color) {
        throw new NotFoundException('Color not found');
      }

      Object.assign(color, data);
      await color.save();

      return color;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Color name already exists');
      }
      throw error;
    }
  },

  async deleteColor(colorId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    await ColorModel.findByIdAndDelete(colorId);
  },
};
