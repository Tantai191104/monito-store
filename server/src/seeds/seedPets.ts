/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import PetModel from '../models/petModel';
import UserModel from '../models/userModel';
import BreedModel from '../models/breedModel';
import ColorModel from '../models/colorModel';

export const seedPets = async () => {
  try {
    console.log('🌱 Starting to seed pets...');

    // Clear existing pets
    await PetModel.deleteMany({});
    console.log('🗑️  Cleared existing pets');

    // Find admin user
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    // Get breed and color references
    const [
      pomeranianBreed,
      poodleBreed,
      corgiBreed,
      alaskanBreed,
      whiteColor,
      yellowColor,
      sepiaColor,
      grayColor,
      creamColor,
      tricolorColor,
    ] = await Promise.all([
      BreedModel.findOne({ name: 'Pomeranian' }),
      BreedModel.findOne({ name: 'Poodle' }),
      BreedModel.findOne({ name: 'Corgi' }),
      BreedModel.findOne({ name: 'Alaskan Malamute' }),
      ColorModel.findOne({ name: 'White' }),
      ColorModel.findOne({ name: 'Yellow' }),
      ColorModel.findOne({ name: 'Sepia' }),
      ColorModel.findOne({ name: 'Gray' }),
      ColorModel.findOne({ name: 'Cream' }),
      ColorModel.findOne({ name: 'Tricolor' }),
    ]);

    if (!pomeranianBreed || !poodleBreed || !corgiBreed || !alaskanBreed) {
      throw new Error('Required breeds not found. Please seed breeds first.');
    }

    if (
      !whiteColor ||
      !yellowColor ||
      !sepiaColor ||
      !grayColor ||
      !creamColor ||
      !tricolorColor
    ) {
      throw new Error('Required colors not found. Please seed colors first.');
    }

    // Pet data without SKU
    const petsData = [
      {
        name: 'Pomeranian White',
        breed: pomeranianBreed._id,
        gender: 'Male' as const,
        age: '2 months',
        size: 'Small' as const,
        color: whiteColor._id,
        price: 6900000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description:
          'Adorable white Pomeranian puppy with fluffy coat and playful personality',
        isVaccinated: true,
        isDewormed: true,
        hasCert: true,
        hasMicrochip: false,
        location: 'Vietnam',
        additionalInfo: 'Very friendly and good with children',
        isAvailable: true,
      },
      {
        name: 'Poodle Tiny Yellow',
        breed: poodleBreed._id,
        gender: 'Female' as const,
        age: '2 months',
        size: 'Small' as const,
        color: yellowColor._id,
        price: 3900000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description: 'Tiny yellow Poodle with curly coat and intelligent eyes',
        isVaccinated: true,
        isDewormed: true,
        hasCert: false,
        hasMicrochip: false,
        location: 'Vietnam',
        additionalInfo: 'Very smart and easy to train',
        isAvailable: true,
      },
      {
        name: 'Poodle Tiny Sepia',
        breed: poodleBreed._id,
        gender: 'Male' as const,
        age: '2 months',
        size: 'Small' as const,
        color: sepiaColor._id,
        price: 4000000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description:
          'Beautiful sepia colored tiny Poodle with perfect temperament',
        isVaccinated: true,
        isDewormed: false,
        hasCert: true,
        hasMicrochip: true,
        location: 'Vietnam',
        additionalInfo: 'Loves to play and very social',
        isAvailable: true,
      },
      {
        name: 'Alaskan Malamute Grey',
        breed: alaskanBreed._id,
        gender: 'Male' as const,
        age: '2 months',
        size: 'Large' as const,
        color: grayColor._id,
        price: 8900000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description:
          'Strong and majestic Alaskan Malamute with beautiful gray coat',
        isVaccinated: true,
        isDewormed: true,
        hasCert: true,
        hasMicrochip: true,
        location: 'Vietnam',
        additionalInfo: 'Great for active families, needs lots of exercise',
        isAvailable: true,
      },
      {
        name: 'Pembroke Corgi Cream',
        breed: corgiBreed._id,
        gender: 'Male' as const,
        age: '2 months',
        size: 'Medium' as const,
        color: creamColor._id,
        price: 7900000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description: 'Adorable Pembroke Welsh Corgi with cream colored coat',
        isVaccinated: true,
        isDewormed: true,
        hasCert: false,
        hasMicrochip: false,
        location: 'Vietnam',
        additionalInfo: 'Very loyal and great with kids',
        isAvailable: true,
      },
      {
        name: 'Pembroke Corgi Tricolor',
        breed: corgiBreed._id,
        gender: 'Female' as const,
        age: '2 months',
        size: 'Medium' as const,
        color: tricolorColor._id,
        price: 9000000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description: 'Beautiful tricolor Corgi with classic markings',
        isVaccinated: true,
        isDewormed: true,
        hasCert: true,
        hasMicrochip: false,
        location: 'Vietnam',
        additionalInfo: 'Perfect family dog with great personality',
        isAvailable: true,
      },
      {
        name: 'Pomeranian White Female',
        breed: pomeranianBreed._id,
        gender: 'Female' as const,
        age: '2 months',
        size: 'Small' as const,
        color: whiteColor._id,
        price: 6500000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description: 'Sweet female Pomeranian with pristine white coat',
        isVaccinated: false,
        isDewormed: true,
        hasCert: false,
        hasMicrochip: false,
        location: 'Vietnam',
        additionalInfo: 'Very gentle and loves attention',
        isAvailable: true,
      },
      {
        name: 'Poodle Tiny Grey Cute',
        breed: poodleBreed._id,
        gender: 'Male' as const,
        age: '2 months',
        size: 'Small' as const,
        color: grayColor._id,
        price: 5000000,
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
        ],
        description: 'Cute gray Poodle with soft curly coat',
        isVaccinated: true,
        isDewormed: true,
        hasCert: true,
        hasMicrochip: true,
        location: 'Vietnam',
        additionalInfo: 'Hypoallergenic and great for apartment living',
        isAvailable: true,
      },
    ];

    // Insert pets
    const createdPets = await PetModel.insertMany(petsData);
    console.log(`✅ Successfully seeded ${createdPets.length} pets`);

    return createdPets;
  } catch (error) {
    console.error('❌ Error seeding pets:', error);
    throw error;
  }
};
