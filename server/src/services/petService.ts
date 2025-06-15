/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreatePetPayload, UpdatePetPayload, PetFilters } from '../types/pet';

/**
 * Models
 */
import PetModel from '../models/petModel';
import BreedModel from '../models/breedModel';
import ColorModel from '../models/colorModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const petService = {
  /**
   * Create new pet
   */
  async createPet(data: CreatePetPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Validate breed exists
        const breedExists = await BreedModel.exists({
          _id: data.breed,
          isActive: true,
        }).session(session);
        if (!breedExists) {
          throw new BadRequestException('Invalid breed selected');
        }

        // Validate color exists
        const colorExists = await ColorModel.exists({
          _id: data.color,
          isActive: true,
        }).session(session);
        if (!colorExists) {
          throw new BadRequestException('Invalid color selected');
        }

        const newPet = new PetModel(data);

        await newPet.save({ session });
        await newPet.populate([
          { path: 'breed', select: 'name description' },
          { path: 'color', select: 'name hexCode description' },
        ]);

        return newPet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all pets with filters and pagination
   */
  async getPets(filters: PetFilters) {
    const {
      breed,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      location,
      isAvailable,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query: any = {};

    if (gender) query.gender = gender;
    if (size) query.size = size;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (location) query.location = new RegExp(location, 'i');
    if (isAvailable !== undefined) query.isAvailable = isAvailable;

    // Handle breed filter (can be ObjectId or breed name)
    if (breed) {
      if (mongoose.Types.ObjectId.isValid(breed)) {
        query.breed = breed;
      } else {
        // Find breed by name
        const breedDoc = await BreedModel.findOne({
          name: new RegExp(breed, 'i'),
          isActive: true,
        });
        if (breedDoc) {
          query.breed = breedDoc._id;
        } else {
          // If breed not found, return empty results
          return {
            pets: [],
            pagination: { page, limit, total: 0, pages: 0 },
          };
        }
      }
    }

    // Handle color filter (can be ObjectId or color name)
    if (color) {
      if (mongoose.Types.ObjectId.isValid(color)) {
        query.color = color;
      } else {
        // Find color by name
        const colorDoc = await ColorModel.findOne({
          name: new RegExp(color, 'i'),
          isActive: true,
        });
        if (colorDoc) {
          query.color = colorDoc._id;
        } else {
          // If color not found, return empty results
          return {
            pets: [],
            pagination: { page, limit, total: 0, pages: 0 },
          };
        }
      }
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [pets, total] = await Promise.all([
      PetModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'breed', select: 'name description' },
          { path: 'color', select: 'name hexCode description' },
        ])
        .lean(),
      PetModel.countDocuments(query),
    ]);

    return {
      pets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get pet by ID
   */
  async getPetById(petId: string) {
    const pet = await PetModel.findById(petId).populate([
      { path: 'breed', select: 'name description' },
      { path: 'color', select: 'name hexCode description' },
    ]);

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  },

  /**
   * Update pet
   */
  async updatePet(petId: string, data: UpdatePetPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        // Validate breed if updating
        if (data.breed) {
          const breedExists = await BreedModel.exists({
            _id: data.breed,
            isActive: true,
          }).session(session);
          if (!breedExists) {
            throw new BadRequestException('Invalid breed selected');
          }
        }

        // Validate color if updating
        if (data.color) {
          const colorExists = await ColorModel.exists({
            _id: data.color,
            isActive: true,
          }).session(session);
          if (!colorExists) {
            throw new BadRequestException('Invalid color selected');
          }
        }

        Object.assign(pet, data);
        await pet.save({ session });
        await pet.populate([
          { path: 'breed', select: 'name description' },
          { path: 'color', select: 'name hexCode description' },
        ]);

        return pet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete pet
   */
  async deletePet(petId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        await PetModel.findByIdAndDelete(petId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Update pet availability
   */
  async updateAvailability(petId: string, isAvailable: boolean) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        pet.isAvailable = isAvailable;
        await pet.save({ session });
        await pet.populate([
          { path: 'breed', select: 'name description' },
          { path: 'color', select: 'name hexCode description' },
        ]);

        return pet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};
