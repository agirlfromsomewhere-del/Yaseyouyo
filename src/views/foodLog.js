import { textField } from '../formField.js';
import { getFoodLogForDate, addFoodEntry, deleteFoodEntry, todayISO } from '../db.js';
import { searchFoods, servingKcal } from '../foodData.js';
import { renderTabNav } from '../tabNav.js';
import { focusElement, announce } from '../a11y.js';

export async function renderFoodLog(app) {
  const today = todayISO();
  let todaysFood = await getFoodLogForDate(today);

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = "Today's food";
  container.appendChild(h);

  const totalToday = todaysFood.reduce((sum, e) => sum + e.kcal, 0);
  const totalP = document.createElement('p');
  totalP.textContent = `Logged so far: ${Math.round(totalToday)} kcal`;
  container.appendChild(totalP);

  const h2Search = document.createElement('h2');
  h2Search.textContent = 'Search food reference';
  container.appendChild(h2Search);

  const searchField = textField('Search foods', { type: 'search', id: 'food-search' });
  container.appendChild(searchField.wrap);

  const resultsList = document.createElement('ul');
  resultsList.className = 'item-list';
  container.appendChild(resultsList);

  async function refreshLogList() {
    todaysFood = await getFoodLogForDate(today);
    logList.innerHTML = '';
    for (const entry of todaysFood) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      const name = document.createElement('span');
      name.className = 'item-name';
      name.textContent = entry.name;
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = ` — ${entry.kcal} kcal`;
      info.append(name, meta);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'button-danger';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove ${entry.name}`);
      removeBtn.addEventListener('click', async () => {
        await deleteFoodEntry(entry.id);
        announce(`Removed ${entry.name}`);
        await refreshLogList();
      });

      li.append(info, removeBtn);
      logList.appendChild(li);
    }
    const total = todaysFood.reduce((sum, e) => sum + e.kcal, 0);
    totalP.textContent = `Logged so far: ${Math.round(total)} kcal`;
  }

  function renderResults(query) {
    resultsList.innerHTML = '';
    const matches = query ? searchFoods(query).slice(0, 15) : [];
    for (const food of matches) {
      const kcal = servingKcal(food);
      const li = document.createElement('li');
      const info = document.createElement('span');
      info.textContent = `${food.name} — ${food.servingDesc} (${kcal} kcal)`;
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'button-primary';
      addBtn.textContent = 'Add';
      addBtn.setAttribute('aria-label', `Add ${food.name}, ${kcal} kcal`);
      addBtn.addEventListener('click', async () => {
        await addFoodEntry({ name: `${food.name} (${food.servingDesc})`, kcal }, today);
        announce(`Added ${food.name}`);
        await refreshLogList();
      });
      li.append(info, addBtn);
      resultsList.appendChild(li);
    }
  }

  searchField.input.addEventListener('input', () => {
    renderResults(searchField.input.value);
  });

  const h2Manual = document.createElement('h2');
  h2Manual.textContent = 'Log something else';
  container.appendChild(h2Manual);

  const manualForm = document.createElement('form');
  manualForm.noValidate = true;
  const nameField = textField('Food name', { id: 'manual-food-name' });
  const kcalField = textField('Calories (kcal)', { type: 'number', id: 'manual-food-kcal' });
  const manualSubmit = document.createElement('button');
  manualSubmit.type = 'submit';
  manualSubmit.className = 'button-primary';
  manualSubmit.textContent = 'Add to log';
  manualForm.append(nameField.wrap, kcalField.wrap, manualSubmit);
  container.appendChild(manualForm);

  manualForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!nameField.input.value.trim()) {
      nameField.error.show('Enter a name.');
      hasError = true;
    } else {
      nameField.error.clear();
    }
    const kcal = Number(kcalField.input.value);
    if (!kcal || kcal < 0) {
      kcalField.error.show('Enter a valid calorie amount.');
      hasError = true;
    } else {
      kcalField.error.clear();
    }
    if (hasError) return;

    await addFoodEntry({ name: nameField.input.value.trim(), kcal: Math.round(kcal) }, today);
    announce(`Added ${nameField.input.value.trim()}`);
    nameField.input.value = '';
    kcalField.input.value = '';
    await refreshLogList();
  });

  const h2Log = document.createElement('h2');
  h2Log.textContent = "Today's entries";
  container.appendChild(h2Log);

  const logList = document.createElement('ul');
  logList.className = 'item-list';
  container.appendChild(logList);

  container.appendChild(renderTabNav('food'));
  app.appendChild(container);
  focusElement(h);

  await refreshLogList();
}
