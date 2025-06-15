export const productsData = [
  // Dog Food
  {
    name: 'Premium Dog Food - Adult Formula',
    category: 'Food', // Will be replaced with ObjectId in seed
    brand: 'Royal Canin',
    price: 1200000,
    originalPrice: 1400000,
    description:
      'Complete and balanced nutrition for adult dogs. Made with high-quality protein and essential nutrients.',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      weight: '3kg',
      ingredients: ['Chicken', 'Rice', 'Corn', 'Vitamins', 'Minerals'],
    },
    stock: 50,
    tags: ['premium', 'nutritious', 'adult'],
    gifts: ['Free feeding bowl'],
  },
  {
    name: 'Puppy Training Treats',
    category: 'Food',
    brand: 'Pedigree',
    price: 350000,
    description:
      'Delicious training treats perfect for puppy training and rewards.',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      weight: '500g',
      ingredients: ['Chicken', 'Sweet Potato', 'Peas'],
    },
    stock: 100,
    tags: ['training', 'puppy', 'treats'],
  },

  // Dog Toys
  {
    name: 'Interactive Puzzle Toy',
    category: 'Toy',
    brand: 'KONG',
    price: 450000,
    originalPrice: 500000,
    description:
      'Mental stimulation toy that challenges your dog and reduces boredom.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Medium',
      material: 'Durable Rubber',
      color: 'Blue',
    },
    stock: 30,
    tags: ['interactive', 'puzzle', 'mental-stimulation'],
    gifts: ['Training guide'],
  },
  {
    name: 'Rope Chew Toy',
    category: 'Toy',
    brand: 'Mammoth',
    price: 180000,
    description:
      'Natural cotton rope toy perfect for chewing and dental health.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Large',
      material: '100% Cotton',
      color: 'Natural',
    },
    stock: 75,
    tags: ['chew', 'dental', 'natural'],
  },

  // Dog Accessories
  {
    name: 'Adjustable Dog Collar',
    category: 'Accessory',
    brand: 'Flexi',
    price: 320000,
    description:
      'Comfortable and adjustable collar with reflective strips for night walks.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Medium',
      material: 'Nylon',
      color: 'Black',
    },
    stock: 40,
    tags: ['collar', 'adjustable', 'reflective'],
  },
  {
    name: 'Retractable Dog Leash',
    category: 'Accessory',
    brand: 'Flexi',
    price: 580000,
    originalPrice: 650000,
    description:
      'High-quality retractable leash with 5-meter extension and comfortable grip.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: '5 meters',
      material: 'Plastic and Nylon',
      color: 'Red',
    },
    stock: 25,
    tags: ['leash', 'retractable', 'comfortable'],
  },

  // Healthcare
  {
    name: 'Dog Multivitamin Tablets',
    category: 'Healthcare',
    brand: 'VetriScience',
    price: 420000,
    description:
      'Complete multivitamin supplement for dogs with essential vitamins and minerals.',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      weight: '60 tablets',
      ingredients: [
        'Vitamin A',
        'Vitamin D',
        'Vitamin E',
        'B-Complex',
        'Minerals',
      ],
    },
    stock: 60,
    tags: ['vitamins', 'health', 'supplement'],
  },
  {
    name: 'Flea & Tick Shampoo',
    category: 'Healthcare',
    brand: 'Bio-Groom',
    price: 280000,
    description:
      'Natural flea and tick shampoo that cleanses and protects your dog.',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      weight: '355ml',
      material: 'Natural Formula',
      ingredients: ['Natural Oils', 'Citrus Extract', 'Aloe Vera'],
    },
    stock: 35,
    tags: ['flea', 'tick', 'natural', 'shampoo'],
  },

  // Grooming
  {
    name: 'Professional Dog Brush',
    category: 'Grooming',
    brand: 'FURminator',
    price: 680000,
    originalPrice: 750000,
    description:
      'Professional grooming brush that reduces shedding by up to 90%.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Large',
      material: 'Stainless Steel',
      color: 'Yellow and Black',
    },
    stock: 20,
    tags: ['grooming', 'professional', 'deshedding'],
    gifts: ['Grooming guide'],
  },
  {
    name: 'Dog Nail Clippers',
    category: 'Grooming',
    brand: 'Millers Forge',
    price: 220000,
    description:
      'Professional-grade nail clippers with safety guard and comfortable grip.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Medium',
      material: 'Stainless Steel',
      color: 'Silver',
    },
    stock: 45,
    tags: ['nail-care', 'clippers', 'professional'],
  },

  // Other
  {
    name: 'Orthopedic Dog Bed',
    category: 'Other',
    brand: 'BarksBar',
    price: 1500000,
    originalPrice: 1800000,
    description:
      'Memory foam orthopedic bed that provides superior comfort and joint support.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Large (100x70cm)',
      material: 'Memory Foam',
      color: 'Gray',
    },
    stock: 15,
    tags: ['orthopedic', 'comfort', 'memory-foam'],
    gifts: ['Removable cover'],
  },
  {
    name: 'Stainless Steel Food Bowl Set',
    category: 'Other',
    brand: 'Bonza',
    price: 380000,
    description: 'Non-slip stainless steel bowl set with food and water bowls.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
    ],
    specifications: {
      size: 'Medium (2 bowls)',
      material: 'Stainless Steel',
      color: 'Silver',
    },
    stock: 80,
    tags: ['feeding', 'stainless-steel', 'non-slip'],
  },
];
