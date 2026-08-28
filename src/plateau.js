// Body-fat plateau detection: if body-fat % logged at least
// MIN_GAP_DAYS apart hasn't moved by more than PLATEAU_THRESHOLD_PCT
// percentage points, surface general, non-prescriptive suggestions.
// This is deliberately simple (compares the earliest and latest fat%
// reading within the lookback window) rather than a trend/regression —
// good enough to nudge the user, not a clinical assessment.

const LOOKBACK_DAYS = 21;
const MIN_GAP_DAYS = 14;
const PLATEAU_THRESHOLD_PCT = 0.5;

export const PLATEAU_SUGGESTIONS = [
  'Add strength training 2-3 times a week — building muscle raises how many calories your body burns at rest over time. See the Exercise tab for beginner-friendly moves that need no equipment.',
  'Double-check portion sizes and easy-to-miss calories (cooking oil, dressings, sugary drinks) — small logging gaps add up over a couple of weeks.',
  'Body fat can plateau temporarily from water retention, hormonal cycles, or day-to-day variation — give it another 1-2 weeks before changing your plan.',
  'As you lose weight your maintenance calories (TDEE) drop too, so a calorie target that worked a month ago may no longer be a real deficit — consider updating your weight in your profile so it recalculates.',
  'If you’ve been very consistent for 3+ weeks with no change at all, a short diet break (about a week at maintenance calories) can help before continuing.',
];

function daysBetween(aISO, bISO) {
  const a = new Date(aISO);
  const b = new Date(bISO);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

// weightLog: full sorted weight log (ascending by date). Returns null if
// there isn't enough body-fat data to judge, otherwise
// { plateaued, changePct, days, suggestions }.
export function checkFatPlateau(weightLog) {
  const withFat = weightLog.filter((e) => typeof e.bodyFatPct === 'number');
  if (withFat.length < 2) return null;

  const latest = withFat[withFat.length - 1];
  const cutoffISO = new Date(new Date(latest.dateISO).getTime() - LOOKBACK_DAYS * 86400000)
    .toISOString()
    .slice(0, 10);
  const inWindow = withFat.filter((e) => e.dateISO >= cutoffISO);
  if (inWindow.length < 2) return null;

  const earliest = inWindow[0];
  const days = daysBetween(earliest.dateISO, latest.dateISO);
  if (days < MIN_GAP_DAYS) return null;

  const changePct = latest.bodyFatPct - earliest.bodyFatPct;
  const plateaued = Math.abs(changePct) < PLATEAU_THRESHOLD_PCT;

  return { plateaued, changePct, days, suggestions: plateaued ? PLATEAU_SUGGESTIONS : [] };
}
