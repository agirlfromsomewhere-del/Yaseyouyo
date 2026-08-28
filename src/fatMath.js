// Deficit <-> body-weight-change math.
//
// 7700 kcal/kg is the standard practical estimate for a kg of body fat
// (some sources say 7716, or 9000 for pure adipose tissue in isolation;
// 7700 is the widely-used approximation and is what this app uses
// throughout). This is a population-average estimate, not a guarantee for
// any individual — real week-to-week weight change is also affected by
// water retention, glycogen stores, and lean mass changes, which this
// simple model does not account for.
export const KCAL_PER_KG = 7700;

// Given a steady daily deficit (kcal) sustained for `days`, how much body
// weight (kg) is that expected to remove? Negative dailyDeficit (i.e. a
// surplus) returns a negative number (expected gain).
export function estimateWeightChangeKg(dailyDeficitKcal, days) {
  return (dailyDeficitKcal * days) / KCAL_PER_KG;
}

// Given a target weight change (kg, positive = loss) and a steady daily
// deficit, how many days are needed? Returns Infinity if the deficit is
// zero or working against the desired direction of change.
export function daysToChangeWeight(deltaKg, dailyDeficitKcal) {
  if (dailyDeficitKcal === 0) return Infinity;
  if (Math.sign(deltaKg) !== Math.sign(dailyDeficitKcal) && deltaKg !== 0) return Infinity;
  return (deltaKg * KCAL_PER_KG) / dailyDeficitKcal;
}
