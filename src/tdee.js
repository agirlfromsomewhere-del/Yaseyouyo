// TDEE (Total Daily Energy Expenditure) math.
// Mifflin-St Jeor is the default (needs sex); Katch-McArdle is offered as
// an alternative that uses body-fat % instead of sex, for anyone who
// knows their body-fat % and would rather not answer the sex question.

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  { id: 'light', label: 'Light exercise (1-3 days/week)', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderate exercise (3-5 days/week)', multiplier: 1.55 },
  { id: 'active', label: 'Hard exercise (6-7 days/week)', multiplier: 1.725 },
  { id: 'veryActive', label: 'Very hard exercise + physical job', multiplier: 1.9 },
];

export function activityMultiplier(activityId) {
  const level = ACTIVITY_LEVELS.find((l) => l.id === activityId);
  return level ? level.multiplier : ACTIVITY_LEVELS[0].multiplier;
}

export function bmrMifflinStJeor({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'female' ? base - 161 : base + 5;
}

export function bmrKatchMcArdle({ weightKg, bodyFatPct }) {
  const leanMassKg = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * leanMassKg;
}

// profile: { weightKg, heightCm, age, activity, method: 'mifflin'|'katch',
//            sex? (mifflin), bodyFatPct? (katch) }
export function calculateBMR(profile) {
  if (profile.method === 'katch') {
    return bmrKatchMcArdle(profile);
  }
  return bmrMifflinStJeor(profile);
}

export function calculateTDEE(profile) {
  const bmr = calculateBMR(profile);
  return bmr * activityMultiplier(profile.activity);
}
