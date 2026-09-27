export const CRAFT_CATEGORIES = [
  { id: 'all', name: 'All Crafts', icon: 'Sparkles', count: 0 },
  { id: 'Wood Craft', name: 'Wood Craft', icon: 'Trees', count: 0 },
  { id: 'Pottery', name: 'Pottery & Ceramics', icon: 'UtensilsCrossed', count: 0 },
  { id: 'Terracotta', name: 'Terracotta', icon: 'Flame', count: 0 },
  { id: 'Handloom', name: 'Handloom & Textiles', icon: 'Scissors', count: 0 },
  { id: 'Bamboo', name: 'Bamboo & Cane', icon: 'Shield', count: 0 },
  { id: 'Metal Craft', name: 'Metal & Brass', icon: 'Crown', count: 0 },
  { id: 'Silk Craft', name: 'Silk & Zari', icon: 'Gem', count: 0 },
  { id: 'Paintings', name: 'Folk Paintings', icon: 'Palette', count: 0 },
];

export const INITIAL_COUPONS = [
  {
    id: 'coup_1',
    code: 'CRAFT20',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_amount: 500,
    description: 'Craft marketplace special - 20% Instant Discount',
    is_active: true,
  },
  {
    id: 'coup_2',
    code: 'HERITAGE500',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_amount: 2500,
    description: 'Heritage collection discount',
    is_active: true,
  },
  {
    id: 'coup_3',
    code: 'ARTISAN15',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 1000,
    description: 'Artisan marketplace discount',
    is_active: true,
  },
];
