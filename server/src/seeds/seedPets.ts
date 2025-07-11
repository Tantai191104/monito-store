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
          'https://plus.unsplash.com/premium_photo-1719177518229-79d47d45d49a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1719177518217-e0f88beef53c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1719177518211-50ac5ae975ca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://images.unsplash.com/photo-1598411304015-75cc0a8b113b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1665124792891-925c0a2cfc50?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1681402521852-7f8e606ad905?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://plus.unsplash.com/premium_photo-1707410050552-e94a738102a1?q=80&w=1300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1707410048990-c9e0fb4e3956?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1707410051091-b22632caf2d6?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://plus.unsplash.com/premium_photo-1663047750334-083dc24d3a63?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1667675417001-c4e97f0bc531?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1673482660366-c973ac15c417?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://images.unsplash.com/photo-1713575284366-7f557be3180f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1710406095853-170789b14896?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1710406095492-7e62eba19745?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://images.unsplash.com/photo-1708994369888-ffa35843ab37?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1654994984034-c803976c4f57?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1654994984034-c803976c4f57?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1660235080568-eae3875b034f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://images.unsplash.com/photo-1683212424755-9d08db98738c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1683212415804-f2fac15d98b5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1683212402719-4403b2ea1b87?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          'https://plus.unsplash.com/premium_photo-1671826728091-7019b1f9ec9e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1672437797146-71f7999bc7c3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
