export const productsData = [
  // Dog Food
  {
    name: 'Premium Dog Food - Adult Formula',
    category: 'Food',
    brand: 'Royal Canin',
    price: 1200000,
    originalPrice: 1400000,
    description:
      'Complete and balanced nutrition for adult dogs. Made with high-quality protein and essential nutrients.',
    images: [
      'https://bizweb.dktcdn.net/100/407/286/products/imageservice-88-236299f9-38c6-42b1-af26-9504b9ade61f.jpg?v=1647801823507',
      'https://bfasset.costco-static.com/U447IH35/as/gwk7qjhfhhgswc8zfrbwv/100343454-847__1?auto=webp&amp;format=jpg&width=600&height=600&fit=bounds&canvas=600,600',
      'https://www.spikesandhoules.com/media/catalog/product/cache/552aa5ee50ba4e27dfcb5fa3e4dca5ac/d/i/diamond98010202-c.jpg',
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
      'https://i5.walmartimages.com/seo/Purina-Puppy-Chow-Dog-Training-Treats-Healthy-Start-with-Real-Salmon-7-oz-Pouch_c1c6d93f-8820-471a-a4d8-f54be894fc72.d486f42270d03ffb39f0291d01acd024.jpeg',
      'https://www.bluebuffalo.com/globalassets/product-detail-pages/dog-treats/baby-blue/large-product-image/babyblue_dog_treat_chickenbits.png',
      'https://npicpet.com/cdn/shop/products/912511_NB_PuppyTrainingTreats_FRONT.jpg?v=1668635604',
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
      'https://images.ctfassets.net/sfnkq8lmu5d7/79dL0jrsDoUOLLTUN1p5Hx/ce9389bc1e04daf74eb2a1d028a39803/The-Wildest_Editorial_Interactive-Dog-Puzzle-Toys_Hero_1000x750.jpg?w=1000&h=750&fl=progressive&q=70&fm=jpg',
      'https://m.media-amazon.com/images/I/71yok3kaG9L.jpg',
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
      'https://m.media-amazon.com/images/I/61oFaaLO2ZL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/718ka+XJk2L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71d4lIYjNyL._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/71dhxd3oWPL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71Xdip7l8ZL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71iWH4emOiL._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/71hdG7p2IQL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71hBHzBKPSL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/812YAKADRdL._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/61xFbR8-wfL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71XvAwkagpL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71zK8ob1EUL._SL1500_.jpg',
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
      'https://sea.wahl.com/sea.wahlglobal.com/media/Products/Animal/Shampoo/820007%20-%20Flea%20and%20Tick%20Shampoo/Animal-Shampoo-Tile-Flea-Tick.jpg?ext=.jpg',
      'https://sea.wahl.com/sea.wahlglobal.com/media/Products/Animal/Shampoo/820007%20-%20Flea%20and%20Tick%20Shampoo/Flea-Tick-Shampoo-700ml.jpg?ext=.jpg',
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
      'https://m.media-amazon.com/images/I/71hR8lkLwKL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71UaqcckkhL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81zOlH-BU-L._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/61QfrOQpHfL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71znHwfMtYL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71DRQtr7GjL._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/71Glb77vr1L._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/818JwG-apiL._AC_SL1500_.jpg',
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
      'https://m.media-amazon.com/images/I/71uU47jeLdL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81TorY5RHHL._AC_SL1500_.jpg',
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
