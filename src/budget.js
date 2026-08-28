import { getProfile, getGoal, getLatestWeight, getFoodLogForDate, todayISO } from './db.js';
import { calculateTDEE } from './tdee.js';
import { planGoal } from './goalPlanner.js';

// Shared "what's today's calorie situation" computation, used by the
// dashboard and the food-suggestions view so they never disagree.
export async function getTodaysBudget() {
  const profile = await getProfile();
  if (!profile) return null;

  const latestWeight = await getLatestWeight();
  const goal = await getGoal();
  const today = todayISO();
  const todaysFood = await getFoodLogForDate(today);
  const totalToday = todaysFood.reduce((sum, e) => sum + e.kcal, 0);

  const tdee = calculateTDEE({ ...profile, weightKg: latestWeight?.weightKg ?? 70 });

  let dailyTarget = tdee;
  let plan = null;
  if (goal?.goalWeightKg && goal?.targetDateISO && latestWeight) {
    plan = planGoal({
      currentWeightKg: latestWeight.weightKg,
      goalWeightKg: goal.goalWeightKg,
      targetDate: new Date(goal.targetDateISO),
      tdee,
    });
    if (plan.valid) dailyTarget = plan.dailyCalorieTarget;
  }

  return {
    profile,
    latestWeight,
    goal,
    today,
    todaysFood,
    totalToday,
    tdee,
    dailyTarget,
    remaining: dailyTarget - totalToday,
    plan,
  };
}
