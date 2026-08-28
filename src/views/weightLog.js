import { textField } from '../formField.js';
import { getProfile, getWeightLog, addWeightEntry, deleteWeightEntry, todayISO } from '../db.js';
import { lbToKg, kgToLb, formatWeight } from '../units.js';
import { checkFatPlateau } from '../plateau.js';
import { renderTabNav } from '../tabNav.js';
import { navButton } from '../nav.js';
import { focusElement, announce } from '../a11y.js';

export async function renderWeightLog(app) {
  const profile = await getProfile();
  const log = await getWeightLog();

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Weight log';
  container.appendChild(h);

  const isImperial = profile?.unitSystem === 'imperial';
  const massUnit = isImperial ? 'lb' : 'kg';

  const form = document.createElement('form');
  form.noValidate = true;
  const weightField = textField(`Weight (${massUnit})`, { type: 'number' });
  const fatField = textField('Body fat % (optional)', {
    type: 'number',
    hint: 'From a body-composition scale, if you have one.',
  });
  const muscleField = textField(`Muscle mass (optional, ${massUnit})`, { type: 'number' });

  const dateWrap = document.createElement('div');
  dateWrap.className = 'field';
  const dateLabel = document.createElement('label');
  dateLabel.setAttribute('for', 'weight-date');
  dateLabel.textContent = 'Date';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'weight-date';
  dateInput.value = todayISO();
  dateWrap.append(dateLabel, dateInput);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button-primary';
  submit.textContent = 'Log today';

  form.append(weightField.wrap, fatField.wrap, muscleField.wrap, dateWrap, submit);
  container.appendChild(form);

  if (log.length >= 2) {
    const first = log[0];
    const latest = log[log.length - 1];
    const changeKg = latest.weightKg - first.weightKg;
    const summary = document.createElement('p');
    summary.textContent = `Since ${first.dateISO}: ${changeKg <= 0 ? 'down' : 'up'} ${
      isImperial ? Math.abs(changeKg * 2.20462262).toFixed(1) + ' lb' : Math.abs(changeKg).toFixed(1) + ' kg'
    }`;
    container.appendChild(summary);
  }

  const plateau = checkFatPlateau(log);
  if (plateau?.plateaued) {
    const banner = document.createElement('div');
    banner.className = 'banner banner-warning';

    const heading = document.createElement('p');
    heading.style.margin = '0 0 0.5rem';
    heading.innerHTML = `<strong>Your body fat % has barely moved (${plateau.changePct >= 0 ? '+' : ''}${plateau.changePct.toFixed(1)} points) over the last ${plateau.days} days.</strong> A few things that can help:`;
    banner.appendChild(heading);

    const tips = document.createElement('ul');
    for (const tip of plateau.suggestions) {
      const li = document.createElement('li');
      li.textContent = tip;
      tips.appendChild(li);
    }
    banner.appendChild(tips);

    const exerciseLink = navButton('exercise', 'Browse exercises', 'button-primary');
    banner.appendChild(exerciseLink);

    container.appendChild(banner);
  }

  const h2 = document.createElement('h2');
  h2.textContent = 'History';
  container.appendChild(h2);

  if (!log.length) {
    const p = document.createElement('p');
    p.textContent = 'No entries yet.';
    container.appendChild(p);
  } else {
    const list = document.createElement('ul');
    list.className = 'item-list';
    for (const entry of [...log].reverse()) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      let text = `${entry.dateISO} — ${formatWeight(entry.weightKg, profile?.unitSystem)}`;
      if (typeof entry.bodyFatPct === 'number') text += `, ${entry.bodyFatPct.toFixed(1)}% fat`;
      if (typeof entry.muscleMassKg === 'number') {
        const muscleDisplay = isImperial ? kgToLb(entry.muscleMassKg).toFixed(1) : entry.muscleMassKg.toFixed(1);
        text += `, ${muscleDisplay} ${massUnit} muscle`;
      }
      info.textContent = text;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'button-danger';
      removeBtn.textContent = 'Delete';
      removeBtn.setAttribute('aria-label', `Delete weight entry for ${entry.dateISO}`);
      removeBtn.addEventListener('click', async () => {
        await deleteWeightEntry(entry.id);
        announce(`Deleted entry for ${entry.dateISO}`);
        renderWeightLog(app);
      });
      li.append(info, removeBtn);
      list.appendChild(li);
    }
    container.appendChild(list);
  }

  container.appendChild(renderTabNav('weight'));
  app.appendChild(container);
  focusElement(h);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = Number(weightField.input.value);
    if (!raw || raw <= 0) {
      weightField.error.show('Enter a valid weight.');
      return;
    }
    weightField.error.clear();

    let bodyFatPct;
    if (fatField.input.value) {
      bodyFatPct = Number(fatField.input.value);
      if (!(bodyFatPct > 0 && bodyFatPct < 70)) {
        fatField.error.show('Enter a valid body-fat percentage, or leave it blank.');
        return;
      }
      fatField.error.clear();
    }

    let muscleMassKg;
    if (muscleField.input.value) {
      const rawMuscle = Number(muscleField.input.value);
      if (!(rawMuscle > 0)) {
        muscleField.error.show('Enter a valid muscle mass, or leave it blank.');
        return;
      }
      muscleField.error.clear();
      muscleMassKg = isImperial ? lbToKg(rawMuscle) : rawMuscle;
    }

    const weightKg = isImperial ? lbToKg(raw) : raw;
    await addWeightEntry(weightKg, dateInput.value || todayISO(), { bodyFatPct, muscleMassKg });
    announce('Logged.');
    renderWeightLog(app);
  });
}
