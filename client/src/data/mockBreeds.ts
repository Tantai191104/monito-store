import type { Breed } from "@/types/breed";

const breedData = [
  {
    name: 'Golden Retriever',
    description: 'Friendly, intelligent, and devoted dogs',
  },
  {
    name: 'Labrador Retriever',
    description: 'Friendly, outgoing, and active dogs',
  },
  {
    name: 'German Shepherd',
    description: 'Confident, courageous, and smart working dogs',
  },
  {
    name: 'Bulldog',
    description: 'Calm, courageous, and friendly with distinctive face',
  },
  {
    name: 'Poodle',
    description: 'Intelligent and active breed in three sizes',
  },
  { name: 'Beagle', description: 'Friendly, curious, and merry hounds' },
  {
    name: 'Rottweiler',
    description: 'Robust working dogs that are loyal and loving',
  },
  {
    name: 'Yorkshire Terrier',
    description: 'Small terrier with silky coat and bold personality',
  },
  {
    name: 'Dachshund',
    description: 'Friendly and spunky dogs with long bodies',
  },
  {
    name: 'Siberian Husky',
    description: 'Medium-sized working dogs with thick coat',
  },
  {
    name: 'Pomeranian',
    description: 'Small, fluffy toy breed with fox-like appearance',
  },
  {
    name: 'Shiba Inu',
    description: 'Alert, agile, and independent Japanese breed',
  },
  {
    name: 'Border Collie',
    description: 'Highly intelligent and energetic herding dogs',
  },
  {
    name: 'Corgi',
    description: 'Short-legged, sturdy dogs with herding instincts',
  },
  { name: 'Chihuahua', description: 'Tiny dogs with huge personalities' },
];

export const generateMockBreeds = (): Breed[] => {
  return breedData.map((breed, index) => ({
    _id: `breed_${index + 1}`,
    name: breed.name,
    description: breed.description,
    petCount: Math.floor(Math.random() * 25) + 1,
    isActive: Math.random() > 0.1, // 90% active
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const mockBreeds = generateMockBreeds();
