import { textField, selectField } from '../formField.js';
import { ACTIVITY_LEVELS } from '../tdee.js';
import { lbToKg, inchesToCm, kgToLb, cmToInches } from '../units.js';
import { saveProfile, addWeightEntry, todayISO } from '../db.js';
import { focusElement, announce } from '../a11y.js';

const activityOptions = ACTIVITY_LEVELS.map((l) => ({ value: l.id, label: l.label }));
const methodOptions = [
  { value: 'mifflin', label: 'Biological sex (Mifflin-St Jeor formula)' },
  { value: 'katch', label: 'Body-fat % instead (Katch-McArdle formula)' },
];
const sexOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];
const unitOptions = [
  { value: 'metric', label: 'Metric (kg, cm)' },
  { value: 'imperial', label: 'Imperial (lb, inches)' },
];

// Renders the shared profile form into `container`. `existing` is the
// current profile (or null for first-time onboarding). `onSaved` is
// called with the saved profile after a successful submit.
export function renderProfileForm(container, { existing, heading, onSaved, currentWeightKg }) {
  const wrap = document.createElement('div');

  let h = null;
  if (heading) {
    h = document.createElement('h1');
    h.textContent = heading;
    wrap.appendChild(h);
  }

  const form = document.createElement('form');
  form.noValidate = true;

  const unitSystem = existing?.unitSystem || 'metric';
  const unit = selectField('Units', unitOptions, { value: unitSystem });

  const age = textField('Age (years)', { type: 'number', value: existing?.age ?? '' });
  const method = selectField('How should we estimate your metabolism?', methodOptions, {
    value: existing?.method || 'mifflin',
  });

  const sex = selectField('Biological sex', sexOptions, { value: existing?.sex || 'female' });
  const bodyFat = textField('Body-fat %', {
    type: 'number',
    value: existing?.bodyFatPct ?? '',
    hint: 'An estimate is fine if you don’t have an exact number.',
  });

  const isImperial = unitSystem === 'imperial';
  const heightValue = existing?.heightCm
    ? isImperial
      ? cmToInches(existing.heightCm).toFixed(1)
      : existing.heightCm
    : '';
  const height = textField(isImperial ? 'Height (inches)' : 'Height (cm)', {
    type: 'number',
    value: heightValue,
    id: 'height-field',
  });

  const weightValue = currentWeightKg
    ? isImperial
      ? kgToLb(currentWeightKg).toFixed(1)
      : currentWeightKg
    : '';
  const weight = textField(isImperial ? 'Current weight (lb)' : 'Current weight (kg)', {
    type: 'number',
    value: weightValue,
    id: 'weight-field',
  });

  const activity = selectField('Activity level', activityOptions, {
    value: existing?.activity || 'sedentary',
  });

  function updateVisibility() {
    const isKatch = method.input.value === 'katch';
    sex.wrap.hidden = isKatch;
    bodyFat.wrap.hidden = !isKatch;
    const nowImperial = unit.input.value === 'imperial';
    height.wrap.querySelector('label').textContent = nowImperial ? 'Height (inches)' : 'Height (cm)';
    weight.wrap.querySelector('label').textContent = nowImperial
      ? 'Current weight (lb)'
      : 'Current weight (kg)';
  }
  method.input.addEventListener('change', updateVisibility);

  // Track the unit system the visible field values are currently in, so
  // switching units converts the numbers instead of just relabeling them.
  let displayedUnit = unitSystem;
  unit.input.addEventListener('change', () => {
    const nowImperial = unit.input.value === 'imperial';
    const wasImperial = displayedUnit === 'imperial';
    if (nowImperial !== wasImperial) {
      const heightNum = Number(height.input.value);
      if (heightNum > 0) {
        height.input.value = (nowImperial ? cmToInches(heightNum) : inchesToCm(heightNum)).toFixed(1);
      }
      const weightNum = Number(weight.input.value);
      if (weightNum > 0) {
        weight.input.value = (nowImperial ? kgToLb(weightNum) : lbToKg(weightNum)).toFixed(1);
      }
    }
    displayedUnit = unit.input.value;
    updateVisibility();
  });
  updateVisibility();

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Save';

  form.append(
    unit.wrap,
    age.wrap,
    method.wrap,
    sex.wrap,
    bodyFat.wrap,
    height.wrap,
    weight.wrap,
    activity.wrap,
    submit
  );
  wrap.appendChild(form);
  container.appendChild(wrap);
  if (h) focusElement(h);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let hasError = false;

    const ageVal = Number(age.input.value);
    if (!ageVal || ageVal <= 0 || ageVal > 120) {
      age.error.show('Enter a valid age.');
      hasError = true;
    } else {
      age.error.clear();
    }

    const heightRaw = Number(height.input.value);
    if (!heightRaw || heightRaw <= 0) {
      height.error.show('Enter a valid height.');
      hasError = true;
    } else {
      height.error.clear();
    }

    const weightRaw = Number(weight.input.value);
    if (!weightRaw || weightRaw <= 0) {
      weight.error.show('Enter a valid weight.');
      hasError = true;
    } else {
      weight.error.clear();
    }

    let bodyFatVal;
    if (method.input.value === 'katch') {
      bodyFatVal = Number(bodyFat.input.value);
      if (!bodyFatVal || bodyFatVal <= 0 || bodyFatVal >= 70) {
        bodyFat.error.show('Enter a valid body-fat percentage.');
        hasError = true;
      } else {
        bodyFat.error.clear();
      }
    }

    if (hasError) {
      announce('Please fix the highlighted fields.');
      return;
    }

    const nowImperial = unit.input.value === 'imperial';
    const heightCm = nowImperial ? inchesToCm(heightRaw) : heightRaw;
    const weightKg = nowImperial ? lbToKg(weightRaw) : weightRaw;

    const profile = await saveProfile({
      unitSystem: unit.input.value,
      age: ageVal,
      method: method.input.value,
      sex: sex.input.value,
      bodyFatPct: bodyFatVal,
      heightCm,
      activity: activity.input.value,
    });

    await addWeightEntry(weightKg, todayISO());

    announce('Profile saved.');
    onSaved(profile);
  });
}
