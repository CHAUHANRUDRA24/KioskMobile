import { Product } from './types';

export const CATEGORIES = [
  "Women's Health",
  "Pregnancy",
  "Sexual Wellness",
  "Hygiene",
  "First Aid"
];

export const PRODUCTS: Product[] = [
  // Women's Health
  {
    id: 'w1',
    name: 'Regular Sanitary Pad',
    price: 15,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid'
  },
  {
    id: 'w2',
    name: 'XL Sanitary Pad',
    price: 20,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid'
  },
  {
    id: 'w3',
    name: 'Painkiller Meftal-Spas',
    price: 30,
    category: "Women's Health",
    imageEmoji: '💊',
    type: 'pill'
  },
  {
    id: 'w4',
    name: 'Menstrual Cup',
    price: 120,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid'
  },

  // Pregnancy
  {
    id: 'p1',
    name: 'Pregnancy Detection Kit',
    price: 50,
    category: 'Pregnancy',
    imageEmoji: '🧪',
    type: 'other'
  },
  {
    id: 'p2',
    name: 'Folic Acid Tablets',
    price: 90,
    category: 'Pregnancy',
    imageEmoji: '💊',
    type: 'pill'
  },
  {
    id: 'p3',
    name: 'Ovulation Test Strips',
    price: 180,
    category: 'Pregnancy',
    imageEmoji: '📏',
    type: 'other'
  },

  // Sexual Wellness
  {
    id: 's1',
    name: 'Condoms (Pack of 3)',
    price: 40,
    category: 'Sexual Wellness',
    imageEmoji: '🛡️',
    type: 'other'
  },
  {
    id: 's2',
    name: 'Emergency Contraceptive Pill',
    price: 110,
    category: 'Sexual Wellness',
    imageEmoji: '💊',
    type: 'pill'
  },
  {
    id: 's3',
    name: 'Personal Lubricant',
    price: 150,
    category: 'Sexual Wellness',
    imageEmoji: '🧪',
    type: 'other'
  },

  // Hygiene
  {
    id: 'h1',
    name: 'Hand Sanitizer',
    price: 30,
    category: 'Hygiene',
    imageEmoji: '🧴',
    type: 'spray'
  },
  {
    id: 'h2',
    name: 'Wet Wipes (Pack of 15)',
    price: 45,
    category: 'Hygiene',
    imageEmoji: '🧻',
    type: 'other'
  },
  {
    id: 'h3',
    name: 'Intimate Wash',
    price: 120,
    category: 'Hygiene',
    imageEmoji: '🧴',
    type: 'other'
  },

  // First Aid
  {
    id: 'f1',
    name: 'Emergency Bandages',
    price: 25,
    category: 'First Aid',
    imageEmoji: '🩹',
    type: 'other'
  },
  {
    id: 'f2',
    name: 'Antiseptic Liquid',
    price: 60,
    category: 'First Aid',
    imageEmoji: '🧴',
    type: 'other'
  },
  {
    id: 'f3',
    name: 'Pain Relief Spray',
    price: 140,
    category: 'First Aid',
    imageEmoji: '💨',
    type: 'spray'
  }
];
