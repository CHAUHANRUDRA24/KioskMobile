import { Product } from './types';

export const CATEGORIES = [
  "Women's Health",
  "Pregnancy",
  "Sexual Wellness",
  "Hygiene",
  "First Aid",
  "Nutrition",
  "Essentials"
];

export const PRODUCTS: Product[] = [
  // Women's Health (6 items)
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
  {
    id: 'w5',
    name: 'Panty Liners (Pack of 20)',
    price: 75,
    category: "Women's Health",
    imageEmoji: '🩸',
    type: 'fluid'
  },
  {
    id: 'w6',
    name: 'Menstrual Relief Patch',
    price: 110,
    category: "Women's Health",
    imageEmoji: '🩹',
    type: 'other'
  },

  // Pregnancy (2 items)
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

  // Sexual Wellness (4 items)
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
  {
    id: 's4',
    name: 'Female Condoms (Pack of 3)',
    price: 90,
    category: 'Sexual Wellness',
    imageEmoji: '🛡️',
    type: 'other'
  },

  // Hygiene (2 items)
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

  // First Aid (3 items)
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
  },

  // Nutrition (1 item)
  {
    id: 'n1',
    name: 'Multivitamin Gummies',
    price: 150,
    category: 'Nutrition',
    imageEmoji: '🍬',
    type: 'pill'
  },

  // Essentials (3 items)
  {
    id: 'e1',
    name: 'Face Mask (Pack of 5)',
    price: 50,
    category: 'Essentials',
    imageEmoji: '😷',
    type: 'other'
  },
  {
    id: 'e2',
    name: 'Digital Thermometer',
    price: 220,
    category: 'Essentials',
    imageEmoji: '🌡️',
    type: 'other'
  },
  {
    id: 'e3',
    name: 'Disposable Gloves (Pair)',
    price: 15,
    category: 'Essentials',
    imageEmoji: '🧤',
    type: 'other'
  }
];
