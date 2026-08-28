import { textField } from '../formField.js';
import { getProfile, getGoal, saveGoal, getLatestWeight, todayISO } from '../db.js';
import { calculateTDEE } from '../tdee.js';
import { planGoal } from '../goalPlanner.js';
import { lbToKg, kgToLb, formatWeight } from '../units.js';
import { renderTabNav } from '../tabNav.js';
import { focusElement, announce } from '../a11y.js';

export async function renderGoal(app) {
  const profile = await getProfile();
  let goal = await getGoal();
  const latestWeight = await getLatestWeight();

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Your goal';
  container.appendChild(h);

  if (!profile || !latestWeight) {
    const p = document.createElement('p');
    p.textContent = 'Set up your profile on the Today tab first.';
    container.appendChild(p);
    container.appendChild(renderTabNav('goal'));
    app.appendChild(container);
    focusElement(h);
    return;
  }

  const isImperial = profile.unitSystem === 'imperial';
  const tdee = calculateTDEE({ ...profile, weightKg: latestWeight.weightKg });

  const form = document.createElement('form');
  form.noValidate = true;

  const goalWeightDisplay = goal?.goalWeightKg
    ? isImperial
      ? kgToLb(goal.goalWeightKg).toFixed(1)
      : goal.goalWeightKg
    : '';
  const goalWeight = textField(isImperial ? 'Goal weight (lb)' : 'Goal weight (kg)', {
    type: 'number',
    value: goalWeightDisplay,
  });

  const dateWrap = document.createElement('div');
  dateWrap.className = 'field';
  const dateLabel = document.createElement('label');
  dateLabel.setAttribute('for', 'target-date');
  dateLabel.textContent = 'Target date';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'target-date';
  dateInput.value = goal?.targetDateISO || '';
  dateWrap.append(dateLabel, dateInput);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Save goal';

  form.append(goalWeight.wrap, dateWrap, submit);
  container.appendChild(form);

  const resultBox = document.createElement('div');
  resultBox.id = 'goal-result';
  container.appendChild(resultBox);

  function renderResult() {
    resultBox.innerHTML = '';
    if (!goal?.goalWeightKg || !goal?.targetDateISO) return;

    const plan = planGoal({
      currentWeightKg: latestWeight.weightKg,
      goalWeightKg: goal.goalWeightKg,
      targetDate: new Date(goal.targetDateISO),
      tdee,
    });

    const card = document.createElement('div');
    card.className = 'card';

    if (!plan.valid) {
      card.className = 'banner banner-danger';
      card.textContent = plan.error;
      resultBox.appendChild(card);
      return;
    }

    const direction = plan.deltaKg > 0 ? 'lose' : 'gain';
    const absDelta = Math.abs(plan.deltaKg).toFixed(1);

    card.innerHTML = `
      <p>To go from <strong>${formatWeight(latestWeight.weightKg, profile.unitSystem)}</strong> to
      <strong>${formatWeight(goal.goalWeightKg, profile.unitSystem)}</strong>
      (${direction} ${isImperial ? kgToLb(Math.abs(plan.deltaKg)).toFixed(1) + ' lb' : absDelta + ' kg'})
      by <strong>${goal.targetDateISO}</strong> (${plan.days} days):</p>
      <p>Daily target: <strong>${Math.round(plan.dailyCalorieTarget)} kcal/day</strong>
      (a ${Math.round(plan.requiredDailyDeficit)} kcal/day ${plan.requiredDailyDeficit >= 0 ? 'deficit' : 'surplus'}
      from your ${Math.round(tdee)} kcal/day maintenance)</p>
      <p>Pace: about ${Math.abs(plan.weeklyRateKg).toFixed(2)} kg/week</p>
    `;
    resultBox.appendChild(card);

    for (const warning of plan.warnings) {
      const banner = document.createElement('div');
      banner.className = 'banner banner-warning';
      banner.textContent = warning;
      resultBox.appendChild(banner);
    }

    const disclaimer = document.createElement('p');
    disclaimer.className = 'disclaimer';
    disclaimer.textContent =
      'Estimates use the common ~7700 kcal-per-kg-of-fat approximation and the Mifflin-St Jeor/Katch-McArdle formulas — real results vary by individual and this is not medical advice.';
    resultBox.appendChild(disclaimer);
  }

  renderResult();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = Number(goalWeight.input.value);
    if (!raw || raw <= 0) {
      goalWeight.error.show('Enter a valid goal weight.');
      return;
    }
    goalWeight.error.clear();

    if (!dateInput.value) {
      announce('Please choose a target date.');
      return;
    }

    const goalWeightKg = isImperial ? lbToKg(raw) : raw;
    goal = await saveGoal({ goalWeightKg, targetDateISO: dateInput.value });
    announce('Goal saved.');
    renderResult();
  });

  container.appendChild(renderTabNav('goal'));
  app.appendChild(container);
  focusElement(h);
}
