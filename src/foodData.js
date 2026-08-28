// A curated static low-calorie food reference. Values are commonly-cited
// nutritional approximations (not lab-measured for any specific product) —
// good enough for rough planning, not a substitute for a real nutrition
// label. Kept fully static/local so the app never needs a food API, key,
// or network connection.
//
// kcalPer100g: calories per 100g of the food.
// servingGrams / servingDesc: a typical real-world serving, for display.

export const FOOD_CATEGORIES = ['vegetable', 'fruit', 'protein', 'grain', 'snack', 'drink'];

export const FOODS = [
  // Vegetables
  { name: 'Broccoli', category: 'vegetable', kcalPer100g: 34, servingGrams: 91, servingDesc: '1 cup chopped' },
  { name: 'Spinach', category: 'vegetable', kcalPer100g: 23, servingGrams: 30, servingDesc: '1 cup raw' },
  { name: 'Cucumber', category: 'vegetable', kcalPer100g: 15, servingGrams: 104, servingDesc: '1 cup sliced' },
  { name: 'Zucchini', category: 'vegetable', kcalPer100g: 17, servingGrams: 124, servingDesc: '1 cup sliced' },
  { name: 'Bell pepper', category: 'vegetable', kcalPer100g: 31, servingGrams: 149, servingDesc: '1 cup sliced' },
  { name: 'Cauliflower', category: 'vegetable', kcalPer100g: 25, servingGrams: 107, servingDesc: '1 cup chopped' },
  { name: 'Carrots', category: 'vegetable', kcalPer100g: 41, servingGrams: 61, servingDesc: '1 medium' },
  { name: 'Tomato', category: 'vegetable', kcalPer100g: 18, servingGrams: 123, servingDesc: '1 medium' },
  { name: 'Romaine lettuce', category: 'vegetable', kcalPer100g: 17, servingGrams: 47, servingDesc: '1 cup shredded' },
  { name: 'Celery', category: 'vegetable', kcalPer100g: 16, servingGrams: 101, servingDesc: '1 cup chopped' },
  { name: 'Mushrooms', category: 'vegetable', kcalPer100g: 22, servingGrams: 70, servingDesc: '1 cup sliced' },
  { name: 'Green beans', category: 'vegetable', kcalPer100g: 31, servingGrams: 100, servingDesc: '1 cup' },
  { name: 'Asparagus', category: 'vegetable', kcalPer100g: 20, servingGrams: 134, servingDesc: '1 cup' },
  { name: 'Cabbage', category: 'vegetable', kcalPer100g: 25, servingGrams: 89, servingDesc: '1 cup shredded' },
  { name: 'Onion', category: 'vegetable', kcalPer100g: 40, servingGrams: 110, servingDesc: '1 medium' },

  // Fruits
  { name: 'Strawberries', category: 'fruit', kcalPer100g: 32, servingGrams: 152, servingDesc: '1 cup' },
  { name: 'Watermelon', category: 'fruit', kcalPer100g: 30, servingGrams: 152, servingDesc: '1 cup diced' },
  { name: 'Cantaloupe', category: 'fruit', kcalPer100g: 34, servingGrams: 160, servingDesc: '1 cup diced' },
  { name: 'Grapefruit', category: 'fruit', kcalPer100g: 42, servingGrams: 123, servingDesc: '1/2 medium' },
  { name: 'Apple', category: 'fruit', kcalPer100g: 52, servingGrams: 182, servingDesc: '1 medium' },
  { name: 'Orange', category: 'fruit', kcalPer100g: 47, servingGrams: 131, servingDesc: '1 medium' },
  { name: 'Peach', category: 'fruit', kcalPer100g: 39, servingGrams: 150, servingDesc: '1 medium' },
  { name: 'Raspberries', category: 'fruit', kcalPer100g: 52, servingGrams: 123, servingDesc: '1 cup' },
  { name: 'Blueberries', category: 'fruit', kcalPer100g: 57, servingGrams: 148, servingDesc: '1 cup' },
  { name: 'Kiwi', category: 'fruit', kcalPer100g: 61, servingGrams: 69, servingDesc: '1 medium' },
  { name: 'Pear', category: 'fruit', kcalPer100g: 57, servingGrams: 178, servingDesc: '1 medium' },

  // Proteins
  { name: 'Chicken breast (cooked, skinless)', category: 'protein', kcalPer100g: 165, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Turkey breast (cooked)', category: 'protein', kcalPer100g: 135, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Egg whites', category: 'protein', kcalPer100g: 52, servingGrams: 100, servingDesc: '~3 large whites' },
  { name: 'Whole egg', category: 'protein', kcalPer100g: 155, servingGrams: 50, servingDesc: '1 large' },
  { name: 'Cod (cooked)', category: 'protein', kcalPer100g: 105, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Tilapia (cooked)', category: 'protein', kcalPer100g: 129, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Shrimp (cooked)', category: 'protein', kcalPer100g: 99, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Tuna (canned in water)', category: 'protein', kcalPer100g: 116, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Greek yogurt (nonfat)', category: 'protein', kcalPer100g: 59, servingGrams: 170, servingDesc: '1 container' },
  { name: 'Cottage cheese (low-fat)', category: 'protein', kcalPer100g: 72, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Tofu (firm)', category: 'protein', kcalPer100g: 76, servingGrams: 100, servingDesc: '100 g' },
  { name: 'Edamame (cooked)', category: 'protein', kcalPer100g: 122, servingGrams: 155, servingDesc: '1 cup' },

  // Grains / carbs
  { name: 'Brown rice (cooked)', category: 'grain', kcalPer100g: 112, servingGrams: 195, servingDesc: '1 cup' },
  { name: 'Quinoa (cooked)', category: 'grain', kcalPer100g: 120, servingGrams: 185, servingDesc: '1 cup' },
  { name: 'Sweet potato (baked)', category: 'grain', kcalPer100g: 90, servingGrams: 130, servingDesc: '1 medium' },
  { name: 'White potato (baked)', category: 'grain', kcalPer100g: 93, servingGrams: 173, servingDesc: '1 medium' },
  { name: 'Whole wheat bread', category: 'grain', kcalPer100g: 247, servingGrams: 28, servingDesc: '1 slice' },
  { name: 'Oats (dry)', category: 'grain', kcalPer100g: 389, servingGrams: 40, servingDesc: '1/2 cup dry' },

  // Snacks (portion-controlled)
  { name: 'Popcorn (air-popped)', category: 'snack', kcalPer100g: 387, servingGrams: 8, servingDesc: '1 cup' },
  { name: 'Rice cake', category: 'snack', kcalPer100g: 387, servingGrams: 9, servingDesc: '1 cake' },
  { name: 'Almonds (portioned)', category: 'snack', kcalPer100g: 579, servingGrams: 15, servingDesc: '~10 almonds' },
  { name: 'Baby carrots', category: 'snack', kcalPer100g: 35, servingGrams: 85, servingDesc: '~8 baby carrots' },
  { name: 'Hard-boiled egg', category: 'snack', kcalPer100g: 155, servingGrams: 50, servingDesc: '1 large' },

  // Drinks
  { name: 'Black coffee', category: 'drink', kcalPer100g: 1, servingGrams: 240, servingDesc: '1 cup' },
  { name: 'Green tea (unsweetened)', category: 'drink', kcalPer100g: 1, servingGrams: 240, servingDesc: '1 cup' },
  { name: 'Sparkling water', category: 'drink', kcalPer100g: 0, servingGrams: 355, servingDesc: '1 can' },
  { name: 'Skim milk', category: 'drink', kcalPer100g: 34, servingGrams: 245, servingDesc: '1 cup' },
  { name: 'Unsweetened almond milk', category: 'drink', kcalPer100g: 13, servingGrams: 240, servingDesc: '1 cup' },
];

export function servingKcal(food) {
  return Math.round((food.kcalPer100g * food.servingGrams) / 100);
}

export function searchFoods(query) {
  const q = query.trim().toLowerCase();
  if (!q) return FOODS;
  return FOODS.filter(
    (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );
}

// Foods whose typical serving fits within `maxKcal`, cheapest first.
export function foodsFittingBudget(maxKcal) {
  return FOODS.map((f) => ({ ...f, kcal: servingKcal(f) }))
    .filter((f) => f.kcal <= maxKcal)
    .sort((a, b) => a.kcal - b.kcal);
}
