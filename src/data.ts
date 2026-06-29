import { Product } from './types';

export const CATEGORIES = [
  "Women's Health",
  "Pregnancy & Fertility",
  "Sexual Wellness",
  "Hygiene & Personal Care",
  "First Aid & Emergency",
  "Health & Nutrition",
  "Travel & Convenience"
];

export const PRODUCTS: Product[] = [
  // Women's Health
  {
    id: 'w1',
    idCode: 'WOMEN-01',
    name: 'Regular Sanitary Pad',
    price: 150,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid',
    description: 'Soft & comfortable protection',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'w2',
    idCode: 'WOMEN-02',
    name: 'XL Sanitary Pad',
    price: 180,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid',
    description: 'Extra long night protection',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'w3',
    idCode: 'WOMEN-03',
    name: 'Overnight Sanitary Pad',
    price: 220,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid',
    description: 'All-night peaceful sleep',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'w4',
    idCode: 'WOMEN-04',
    name: 'Tampon',
    price: 280,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid',
    description: 'Super active comfortable leak-lock',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'w5',
    idCode: 'WOMEN-05',
    name: 'Heating patch',
    price: 120,
    category: "Women's Health",
    imageEmoji: '🩹',
    type: 'other',
    description: 'Fast menstrual cramp relief',
    stockStatus: 'LOW STOCK'
  },
  {
    id: 'w6',
    idCode: 'WOMEN-06',
    name: 'Menstrual Cup',
    price: 350,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid',
    description: 'Reusable eco-friendly protection',
    stockStatus: 'IN STOCK'
  },

  // Pregnancy & Fertility
  {
    id: 'p1',
    idCode: 'PREG-01',
    name: 'Pregnancy Test Kit',
    price: 60,
    category: 'Pregnancy & Fertility',
    imageEmoji: '🧪',
    type: 'other',
    description: '99% accurate instant results',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'p2',
    idCode: 'PREG-02',
    name: 'Ovulation Test Strip',
    price: 50,
    category: 'Pregnancy & Fertility',
    imageEmoji: '🧪',
    type: 'other',
    description: 'Track your fertility window',
    stockStatus: 'IN STOCK'
  },

  // Sexual Wellness
  {
    id: 's1',
    idCode: 'SEX-01',
    name: 'Condom Pack (3 pcs)',
    price: 40,
    category: 'Sexual Wellness',
    imageEmoji: '🛡️',
    type: 'other',
    description: 'Ultra-thin premium protection',
    stockStatus: 'IN STOCK'
  },
  {
    id: 's2',
    idCode: 'SEX-02',
    name: 'Flavoured Condom - Strawberry',
    price: 50,
    category: 'Sexual Wellness',
    imageEmoji: '🍓',
    type: 'other',
    description: 'Sweet strawberry fragrance',
    stockStatus: 'IN STOCK'
  },
  {
    id: 's3',
    idCode: 'SEX-03',
    name: 'Flavoured Condom - Chocolate',
    price: 50,
    category: 'Sexual Wellness',
    imageEmoji: '🍫',
    type: 'other',
    description: 'Rich chocolate flavour',
    stockStatus: 'IN STOCK'
  },
  {
    id: 's4',
    idCode: 'SEX-04',
    name: 'Water-Based Lubricant',
    price: 150,
    category: 'Sexual Wellness',
    imageEmoji: '🧪',
    type: 'other',
    description: 'Smooth silk long-lasting lube',
    stockStatus: 'IN STOCK'
  },

  // Hygiene & Personal Care
  {
    id: 'hc1',
    idCode: 'HYG-01',
    name: 'Wet Wipes Pack',
    price: 35,
    category: 'Hygiene & Personal Care',
    imageEmoji: '🧻',
    type: 'other',
    description: 'Gentle refreshing wet wipes',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'hc2',
    idCode: 'HYG-02',
    name: 'Tissue Pack',
    price: 20,
    category: 'Hygiene & Personal Care',
    imageEmoji: '🧻',
    type: 'other',
    description: 'Soft 3-ply pocket tissue',
    stockStatus: 'IN STOCK'
  },

  // First Aid & Emergency
  {
    id: 'fa1',
    idCode: 'AID-01',
    name: 'Band-Aid Pack',
    price: 25,
    category: 'First Aid & Emergency',
    imageEmoji: '🩹',
    type: 'other',
    description: 'Flexible waterproof bandages',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'fa2',
    idCode: 'AID-02',
    name: 'Antiseptic Wipe',
    price: 15,
    category: 'First Aid & Emergency',
    imageEmoji: '🧼',
    type: 'other',
    description: 'Quick wound cleaning wipes',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'fa3',
    idCode: 'AID-03',
    name: 'Gauze Pad',
    price: 30,
    category: 'First Aid & Emergency',
    imageEmoji: '🩹',
    type: 'other',
    description: 'Sterile absorbent cotton pads',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'fa4',
    idCode: 'AID-04',
    name: 'Soframycin',
    price: 45,
    category: 'First Aid & Emergency',
    imageEmoji: '🧪',
    type: 'other',
    description: 'Antibacterial skin ointment',
    stockStatus: 'IN STOCK'
  },

  // Health & Nutrition
  {
    id: 'n1',
    idCode: 'NUT-01',
    name: 'Glucose Tablet',
    price: 40,
    category: 'Health & Nutrition',
    imageEmoji: '🍬',
    type: 'pill',
    description: 'Instant energy chewable tablets',
    stockStatus: 'IN STOCK'
  },

  // Travel & Convenience
  {
    id: 'tc1',
    idCode: 'TRAV-01',
    name: 'Disposable Razor',
    price: 25,
    category: 'Travel & Convenience',
    imageEmoji: '🪒',
    type: 'other',
    description: 'Smooth glide dual-blade razor',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'tc2',
    idCode: 'TRAV-02',
    name: 'Hand Sanitizer',
    price: 30,
    category: 'Travel & Convenience',
    imageEmoji: '🧴',
    type: 'spray',
    description: 'Kills 99.9% germs on-the-go',
    stockStatus: 'IN STOCK'
  },
  {
    id: 'tc3',
    idCode: 'BAG-01',
    name: 'Discreet Packing Bag',
    price: 5,
    category: 'Travel & Convenience',
    imageEmoji: '🛍️',
    type: 'other',
    description: 'Eco-friendly opaque carry bag',
    stockStatus: 'IN STOCK'
  }
];
