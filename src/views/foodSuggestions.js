import { getTodaysBudget } from '../budget.js';
import { FOOD_CATEGORIES, foodsFittingBudget, searchFoods, servingKcal } from '../foodData.js';
import { addFoodEntry } from '../db.js';
import { renderTabNav } from '../tabNav.js';
import { focusElement, announce } from '../a11y.js';
import { selectField, textField } from '../formField.js';

const categoryOptions = [
  { value: 'all', label: 'All categories' },
  ...FOOD_CATEGORIES.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) })),
];

export async function renderFoodSuggestions(app) {
  const budget = await getTodaysBudget();

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Low-calorie ideas';
  container.appendChild(h);

  const remaining = budget ? Math.max(0, Math.round(budget.remaining)) : null;
  if (remaining != null) {
    const p = document.createElement('p');
    p.textContent = `Showing options that fit your ${remaining} kcal remaining today.`;
    container.appendChild(p);
  }

  const controls = document.createElement('div');
  const category = selectField('Category', categoryOptions, { value: 'all' });
  const search = textField('Search', { type: 'search', id: 'suggestion-search' });
  controls.append(category.wrap, search.wrap);
  container.appendChild(controls);

  const list = document.createElement('ul');
  list.className = 'item-list';
  container.appendChild(list);

  function currentFoods() {
    let foods;
    if (remaining != null) {
      foods = foodsFittingBudget(remaining);
    } else {
      foods = searchFoods('').map((f) => ({ ...f, kcal: servingKcal(f) }));
    }
    if (category.input.value !== 'all') {
      foods = foods.filter((f) => f.category === category.input.value);
    }
    const query = search.input.value.trim().toLowerCase();
    if (query) {
      foods = foods.filter((f) => f.name.toLowerCase().includes(query));
    }
    return foods;
  }

  function renderList() {
    list.innerHTML = '';
    const foods = currentFoods();
    if (!foods.length) {
      const li = document.createElement('li');
      li.textContent = 'No matches — try a different category or search.';
      list.appendChild(li);
      return;
    }
    for (const food of foods) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      info.textContent = `${food.name} — ${food.servingDesc} (${food.kcal} kcal)`;
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'button-primary';
      addBtn.textContent = 'Add to today';
      addBtn.setAttribute('aria-label', `Add ${food.name} to today's log, ${food.kcal} kcal`);
      addBtn.addEventListener('click', async () => {
        await addFoodEntry({ name: `${food.name} (${food.servingDesc})`, kcal: food.kcal });
        announce(`Added ${food.name} to today's log`);
      });
      li.append(info, addBtn);
      list.appendChild(li);
    }
  }

  category.input.addEventListener('change', renderList);
  search.input.addEventListener('input', renderList);
  renderList();

  container.appendChild(renderTabNav('suggestions'));
  app.appendChild(container);
  focusElement(h);
}
