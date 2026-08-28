import { todayISO } from './db.js';

// Consecutive days (walking back from today) that have at least one
// logged food entry and stayed at/under dailyCalorieTarget. Uses today's
// target retroactively for past days too — a deliberate simplification
// (the target may have shifted over time as weight/goal changed), kept
// simple since this is meant as a motivational streak, not an audit.
export function calculateStreak(allFoodLogEntries, dailyCalorieTarget) {
  const totalsByDate = new Map();
  for (const entry of allFoodLogEntries) {
    totalsByDate.set(entry.dateISO, (totalsByDate.get(entry.dateISO) || 0) + entry.kcal);
  }

  let streak = 0;
  const cursor = new Date();
  // If today has no log yet, don't break an existing streak on it —
  // start counting from yesterday until today gets logged.
  if (!totalsByDate.has(todayISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = todayISO(cursor);
    const total = totalsByDate.get(iso);
    if (total == null || total > dailyCalorieTarget) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
