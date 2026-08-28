import { KCAL_PER_KG } from './fatMath.js';

// General, widely-cited safety guardrails (not medical advice — see
// disclaimer surfaced in the UI). Flagged as warnings, never silently
// enforced, since only a doctor/dietitian can judge an individual case.
export const MIN_SAFE_DAILY_CALORIES = 1200;
export const MAX_SAFE_WEEKLY_LOSS_KG = 1;

function daysBetween(fromDate, toDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.round((to - from) / msPerDay);
}

// Plan how to get from currentWeightKg to goalWeightKg by targetDate,
// given today's TDEE. targetDate is a Date object; today defaults to now.
export function planGoal({ currentWeightKg, goalWeightKg, targetDate, tdee, today = new Date() }) {
  const days = daysBetween(today, targetDate);
  if (days <= 0) {
    return { valid: false, error: 'Target date must be in the future.' };
  }

  const deltaKg = currentWeightKg - goalWeightKg; // positive = need to lose
  const totalKcalNeeded = deltaKg * KCAL_PER_KG;
  const requiredDailyDeficit = totalKcalNeeded / days;
  const dailyCalorieTarget = tdee - requiredDailyDeficit;
  const weeklyRateKg = deltaKg / (days / 7);

  const warnings = [];
  if (dailyCalorieTarget < MIN_SAFE_DAILY_CALORIES) {
    warnings.push(
      `This plan works out to about ${Math.round(dailyCalorieTarget)} kcal/day, below the commonly recommended floor of ${MIN_SAFE_DAILY_CALORIES} kcal/day. Consider a later target date instead.`
    );
  }
  if (weeklyRateKg > MAX_SAFE_WEEKLY_LOSS_KG) {
    warnings.push(
      `This plan implies losing about ${weeklyRateKg.toFixed(2)} kg/week, faster than the commonly recommended safe upper bound of ~${MAX_SAFE_WEEKLY_LOSS_KG} kg/week. Consider a later target date instead.`
    );
  }

  return {
    valid: true,
    days,
    deltaKg,
    requiredDailyDeficit,
    dailyCalorieTarget,
    weeklyRateKg,
    warnings,
  };
}
