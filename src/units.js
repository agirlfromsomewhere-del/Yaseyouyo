// All storage/math is in metric (kg, cm). These helpers convert for
// display/input when the user's chosen unit system is imperial.

export function kgToLb(kg) {
  return kg * 2.20462262;
}
export function lbToKg(lb) {
  return lb / 2.20462262;
}
export function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}
export function feetInchesToCm(feet, inches) {
  return (feet * 12 + inches) * 2.54;
}
export function cmToInches(cm) {
  return cm / 2.54;
}
export function inchesToCm(inches) {
  return inches * 2.54;
}

export function formatWeight(kg, unitSystem) {
  if (kg == null || Number.isNaN(kg)) return '—';
  if (unitSystem === 'imperial') {
    return `${kgToLb(kg).toFixed(1)} lb`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function formatHeight(cm, unitSystem) {
  if (cm == null || Number.isNaN(cm)) return '—';
  if (unitSystem === 'imperial') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches.toFixed(0)}"`;
  }
  return `${cm.toFixed(0)} cm`;
}
