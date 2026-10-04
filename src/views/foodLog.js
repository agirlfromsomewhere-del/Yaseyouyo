import { textField, selectField } from '../formField.js';
import {
  getFoodLogForDate,
  addFoodEntry,
  deleteFoodEntry,
  getCustomFoods,
  saveCustomFood,
  deleteCustomFood,
  todayISO,
} from '../db.js';
import { searchFoods, servingKcal } from '../foodData.js';
import { renderTabNav } from '../tabNav.js';
import { focusElement, announce } from '../a11y.js';

const basisOptions = [
  { value: 'serving', label: 'One serving' },
  { value: 'per100g', label: '100 g (I enter the grams I eat)' },
];

function describeCustom(food) {
  const base =
    food.basis === 'per100g'
      ? `${food.kcal} kcal per 100 g`
      : `${food.kcal} kcal${food.servingDesc ? ` per ${food.servingDesc}` : ' per serving'}`;
  return food.estimate ? `${base} (estimate, edit to match yours)` : base;
}

export async function renderFoodLog(app) {
  const today = todayISO();
  let todaysFood = await getFoodLogForDate(today);
  let customFoods = await getCustomFoods();
  let editingId = null;

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = "Today's food";
  container.appendChild(h);

  const totalP = document.createElement('p');
  container.appendChild(totalP);

  // --- Search + quick add ---
  const h2Search = document.createElement('h2');
  h2Search.textContent = 'Find a food';
  container.appendChild(h2Search);

  const searchField = textField('Search your foods and the food reference', {
    type: 'search',
    id: 'food-search',
  });
  container.appendChild(searchField.wrap);

  const resultsList = document.createElement('ul');
  resultsList.className = 'item-list';
  container.appendChild(resultsList);

  async function logAndRefresh(name, kcal) {
    await addFoodEntry({ name, kcal }, today);
    announce(`Added ${name}, ${kcal} kcal`);
    await refreshLogList();
  }

  function builtInRow(food) {
    const kcal = servingKcal(food);
    const li = document.createElement('li');
    const info = document.createElement('span');
    info.textContent = `${food.name} — ${food.servingDesc} (${kcal} kcal)`;
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button-primary';
    addBtn.textContent = 'Add';
    addBtn.setAttribute('aria-label', `Add ${food.name}, ${kcal} kcal`);
    addBtn.addEventListener('click', () => logAndRefresh(`${food.name} (${food.servingDesc})`, kcal));
    li.append(info, addBtn);
    return li;
  }

  function customRow(food) {
    const li = document.createElement('li');
    const info = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'item-name';
    name.textContent = food.name;
    const meta = document.createElement('span');
    meta.className = 'item-meta';
    meta.textContent = ` — ${describeCustom(food)}`;
    info.append(name, meta);
    li.appendChild(info);

    const controls = document.createElement('span');
    let gramsInput = null;
    if (food.basis === 'per100g') {
      gramsInput = document.createElement('input');
      gramsInput.type = 'number';
      gramsInput.inputMode = 'decimal';
      gramsInput.className = 'inline-input';
      gramsInput.value = food.defaultGrams || 100;
      gramsInput.setAttribute('aria-label', `Grams of ${food.name}`);
      controls.append(gramsInput, document.createTextNode(' g '));
    }
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button-primary';
    addBtn.textContent = 'Add';
    addBtn.setAttribute('aria-label', `Add ${food.name}`);
    addBtn.addEventListener('click', () => {
      if (food.basis === 'per100g') {
        const grams = Number(gramsInput.value);
        if (!(grams > 0)) {
          announce('Enter the grams first.');
          gramsInput.focus();
          return;
        }
        logAndRefresh(`${food.name} (${grams} g)`, Math.round((food.kcal * grams) / 100));
      } else {
        const label = food.servingDesc ? `${food.name} (${food.servingDesc})` : food.name;
        logAndRefresh(label, Math.round(food.kcal));
      }
    });
    controls.appendChild(addBtn);
    li.appendChild(controls);
    return li;
  }

  function renderResults() {
    resultsList.innerHTML = '';
    const query = searchField.input.value.trim().toLowerCase();
    const customMatches = customFoods.filter((f) => !query || f.name.toLowerCase().includes(query));
    for (const food of customMatches) resultsList.appendChild(customRow(food));
    if (query) {
      for (const food of searchFoods(query).slice(0, 15)) resultsList.appendChild(builtInRow(food));
    }
    if (!resultsList.children.length) {
      const li = document.createElement('li');
      li.textContent = 'No matches. You can save it as a new food below.';
      resultsList.appendChild(li);
    }
  }
  searchField.input.addEventListener('input', renderResults);

  // --- Log something once (optionally save it) ---
  const h2Manual = document.createElement('h2');
  h2Manual.textContent = 'Log something else';
  container.appendChild(h2Manual);

  const manualForm = document.createElement('form');
  manualForm.noValidate = true;
  const nameField = textField('Food name', { id: 'manual-food-name' });
  const kcalField = textField('Calories (kcal)', { type: 'number', id: 'manual-food-kcal' });
  const saveWrap = document.createElement('div');
  saveWrap.className = 'field';
  const saveBox = document.createElement('input');
  saveBox.type = 'checkbox';
  saveBox.id = 'manual-save';
  saveBox.className = 'inline-checkbox';
  const saveLabel = document.createElement('label');
  saveLabel.setAttribute('for', 'manual-save');
  saveLabel.className = 'inline-label';
  saveLabel.textContent = 'Also save it to my foods for next time';
  saveWrap.append(saveBox, saveLabel);
  const manualSubmit = document.createElement('button');
  manualSubmit.type = 'submit';
  manualSubmit.className = 'button-primary';
  manualSubmit.textContent = 'Add to log';
  manualForm.append(nameField.wrap, kcalField.wrap, saveWrap, manualSubmit);
  container.appendChild(manualForm);

  manualForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let hasError = false;
    const name = nameField.input.value.trim();
    if (!name) {
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

    if (saveBox.checked) {
      await saveCustomFood({ name, basis: 'serving', kcal: Math.round(kcal), servingDesc: '', estimate: false });
      customFoods = await getCustomFoods();
      renderResults();
      renderSaved();
    }
    nameField.input.value = '';
    kcalField.input.value = '';
    saveBox.checked = false;
    await logAndRefresh(name, Math.round(kcal));
  });

  // --- Saved foods: list, add, edit, delete ---
  const h2Saved = document.createElement('h2');
  h2Saved.textContent = 'My saved foods';
  container.appendChild(h2Saved);

  const savedList = document.createElement('ul');
  savedList.className = 'item-list';
  container.appendChild(savedList);

  const formHeading = document.createElement('h3');
  container.appendChild(formHeading);

  const foodForm = document.createElement('form');
  foodForm.noValidate = true;
  const fName = textField('Food name', { id: 'saved-food-name' });
  const fKcal = textField('Calories (kcal)', { type: 'number', id: 'saved-food-kcal' });
  const fBasis = selectField('Those calories are for', basisOptions, { value: 'serving', id: 'saved-food-basis' });
  const fServing = textField('Serving description (optional)', {
    id: 'saved-food-serving',
    hint: 'For example: 1 serving (50 g dry mix), or 240 ml.',
  });
  const fGrams = textField('Usual grams you eat', { type: 'number', id: 'saved-food-grams' });
  const fSubmit = document.createElement('button');
  fSubmit.type = 'submit';
  fSubmit.className = 'button-primary';
  const fCancel = document.createElement('button');
  fCancel.type = 'button';
  fCancel.textContent = 'Cancel editing';
  foodForm.append(fName.wrap, fKcal.wrap, fBasis.wrap, fServing.wrap, fGrams.wrap, fSubmit, fCancel);
  container.appendChild(foodForm);

  function syncBasis() {
    const per100 = fBasis.input.value === 'per100g';
    fServing.wrap.hidden = per100;
    fGrams.wrap.hidden = !per100;
  }
  fBasis.input.addEventListener('change', syncBasis);

  function resetForm() {
    editingId = null;
    formHeading.textContent = 'Save a new food';
    fSubmit.textContent = 'Save food';
    fCancel.hidden = true;
    fName.input.value = '';
    fKcal.input.value = '';
    fBasis.input.value = 'serving';
    fServing.input.value = '';
    fGrams.input.value = '';
    for (const f of [fName, fKcal, fGrams]) f.error.clear();
    syncBasis();
  }

  function startEdit(food) {
    editingId = food.id;
    formHeading.textContent = `Edit ${food.name}`;
    fSubmit.textContent = 'Save changes';
    fCancel.hidden = false;
    fName.input.value = food.name;
    fKcal.input.value = food.kcal;
    fBasis.input.value = food.basis;
    fServing.input.value = food.servingDesc || '';
    fGrams.input.value = food.defaultGrams || '';
    syncBasis();
    focusElement(formHeading);
  }
  fCancel.addEventListener('click', () => {
    resetForm();
    announce('Editing cancelled.');
  });

  function renderSaved() {
    savedList.innerHTML = '';
    if (!customFoods.length) {
      const li = document.createElement('li');
      li.textContent = 'Nothing saved yet.';
      savedList.appendChild(li);
      return;
    }
    for (const food of customFoods) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      const name = document.createElement('span');
      name.className = 'item-name';
      name.textContent = food.name;
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = ` — ${describeCustom(food)}`;
      info.append(name, meta);

      const controls = document.createElement('span');
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', `Edit ${food.name}`);
      editBtn.addEventListener('click', () => startEdit(food));
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'button-danger';
      delBtn.textContent = 'Delete';
      delBtn.setAttribute('aria-label', `Delete saved food ${food.name}`);
      delBtn.addEventListener('click', async () => {
        await deleteCustomFood(food.id);
        customFoods = await getCustomFoods();
        if (editingId === food.id) resetForm();
        announce(`Deleted ${food.name} from your saved foods`);
        renderSaved();
        renderResults();
      });
      controls.append(editBtn, delBtn);
      li.append(info, controls);
      savedList.appendChild(li);
    }
  }

  foodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let hasError = false;
    const name = fName.input.value.trim();
    if (!name) {
      fName.error.show('Enter a name.');
      hasError = true;
    } else {
      fName.error.clear();
    }
    const kcal = Number(fKcal.input.value);
    if (!(kcal >= 0) || fKcal.input.value === '') {
      fKcal.error.show('Enter a valid calorie amount.');
      hasError = true;
    } else {
      fKcal.error.clear();
    }
    const per100 = fBasis.input.value === 'per100g';
    let grams;
    if (per100) {
      grams = Number(fGrams.input.value);
      if (!(grams > 0)) {
        fGrams.error.show('Enter the grams you usually eat.');
        hasError = true;
      } else {
        fGrams.error.clear();
      }
    }
    if (hasError) {
      announce('Please fix the highlighted fields.');
      return;
    }

    await saveCustomFood({
      id: editingId || undefined,
      name,
      basis: fBasis.input.value,
      kcal,
      servingDesc: per100 ? '' : fServing.input.value.trim(),
      defaultGrams: per100 ? grams : undefined,
      estimate: false,
    });
    customFoods = await getCustomFoods();
    announce(editingId ? `Saved changes to ${name}` : `Saved ${name} to your foods`);
    resetForm();
    renderSaved();
    renderResults();
  });

  // --- Today's entries ---
  const h2Log = document.createElement('h2');
  h2Log.textContent = "Today's entries";
  container.appendChild(h2Log);

  const logList = document.createElement('ul');
  logList.className = 'item-list';
  container.appendChild(logList);

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

  container.appendChild(renderTabNav('food'));
  app.appendChild(container);
  focusElement(h);

  resetForm();
  renderResults();
  renderSaved();
  await refreshLogList();
}
