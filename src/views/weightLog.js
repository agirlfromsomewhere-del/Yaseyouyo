import { textField } from '../formField.js';
import { getProfile, getWeightLog, addWeightEntry, deleteWeightEntry, todayISO } from '../db.js';
import { lbToKg, formatWeight } from '../units.js';
import { renderTabNav } from '../tabNav.js';
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

  const form = document.createElement('form');
  form.noValidate = true;
  const weightField = textField(isImperial ? 'Weight (lb)' : 'Weight (kg)', { type: 'number' });

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
  submit.textContent = 'Log weight';

  form.append(weightField.wrap, dateWrap, submit);
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
      info.textContent = `${entry.dateISO} — ${formatWeight(entry.weightKg, profile?.unitSystem)}`;
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
    const weightKg = isImperial ? lbToKg(raw) : raw;
    await addWeightEntry(weightKg, dateInput.value || todayISO());
    announce('Weight logged.');
    renderWeightLog(app);
  });
}
