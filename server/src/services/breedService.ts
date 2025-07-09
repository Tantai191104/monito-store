/**
 * Models
 */
import BreedModel from '../models/breedModel';
import PetModel from '../models/petModel'; // ✅ Import PetModel

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const breedService = {
  async createBreed(data: { name: string; description?: string }) {
    try {
      const newBreed = new BreedModel(data);
      await newBreed.save();
      return newBreed;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Breed already exists in this category');
      }
      throw error;
    }
  },

  async getBreeds() {
    const breeds = await BreedModel.find().sort({ name: 1 });

    // Calculate pet count for each breed
    const breedsWithPetCount = await Promise.all(
      breeds.map(async (breed) => {
        const petCount = await PetModel.countDocuments({
          breed: breed._id,
        });

        return {
          ...breed.toObject(),
          petCount,
        };
      }),
    );

    return breedsWithPetCount;
  },

  async getBreedById(breedId: string) {
    const breed = await BreedModel.findById(breedId);

    if (!breed) {
      throw new NotFoundException('Breed not found');
    }

    const petCount = await PetModel.countDocuments({
      breed: breedId,
    });

    return {
      ...breed.toObject(),
      petCount,
    };
  },

  // ✅ Update method - NO constraint for deactivate
  async updateBreed(
    breedId: string,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const updatedBreed = await BreedModel.findByIdAndUpdate(breedId, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedBreed) {
        throw new NotFoundException('Breed not found');
      }

      // ✅ NO constraint check here - allow deactivate even if pets exist
      return updatedBreed;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Breed name already exists');
      }
      throw error;
    }
  },

  // ✅ Delete method - STRICT constraint
  async deleteBreed(breedId: string) {
    const breed = await BreedModel.findById(breedId);

    if (!breed) {
      throw new NotFoundException('Breed not found');
    }

    // ✅ Check if breed is being used by any pets
    const petsUsingBreed = await PetModel.countDocuments({
      breed: breedId,
    });

    if (petsUsingBreed > 0) {
      throw new BadRequestException(
        `Cannot delete breed "${breed.name}" because it is being used by ${petsUsingBreed} pet(s). Please reassign or delete these pets first.`,
        'BREED_IN_USE',
      );
    }

    await BreedModel.findByIdAndDelete(breedId);
    return { deletedBreed: breed, affectedPets: 0 };
  },

  // ✅ New method for bulk delete with constraint checking
  async bulkDeleteBreeds(breedIds: string[]) {
    const results = {
      deleted: [] as any[],
      failed: [] as {
        breedId: string;
        breedName: string;
        reason: string;
        petCount: number;
      }[],
    };

    for (const breedId of breedIds) {
      try {
        const breed = await BreedModel.findById(breedId);

        if (!breed) {
          results.failed.push({
            breedId,
            breedName: 'Unknown',
            reason: 'Breed not found',
            petCount: 0,
          });
          continue;
        }

        // Check if breed is being used by any pets
        const petsUsingBreed = await PetModel.countDocuments({
          breed: breedId,
        });

        if (petsUsingBreed > 0) {
          results.failed.push({
            breedId,
            breedName: breed.name,
            reason: 'Breed is being used by pets',
            petCount: petsUsingBreed,
          });
          continue;
        }

        // Safe to delete
        await BreedModel.findByIdAndDelete(breedId);
        results.deleted.push(breed);
      } catch (error: any) {
        results.failed.push({
          breedId,
          breedName: 'Unknown',
          reason: error.message || 'Unexpected error',
          petCount: 0,
        });
      }
    }

    return results;
  },

  // ✅ Utility method to get breed usage statistics
  async getBreedUsageStats(breedId: string) {
    const breed = await BreedModel.findById(breedId);
    if (!breed) {
      throw new NotFoundException('Breed not found');
    }

    const petCount = await PetModel.countDocuments({
      breed: breedId,
    });

    // Get sample pets for reference
    const samplePets = await PetModel.find({ breed: breedId })
      .select('name _id')
      .limit(5);

    return {
      breed,
      petCount,
      samplePets,
      canDelete: petCount === 0,
    };
  },
};
