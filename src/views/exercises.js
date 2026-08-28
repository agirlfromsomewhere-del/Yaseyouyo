import { EXERCISE_CATEGORIES, exercisesByCategory, getExerciseById } from '../exerciseData.js';
import { selectField } from '../formField.js';
import { navButton } from '../nav.js';
import { renderTabNav } from '../tabNav.js';
import { focusElement } from '../a11y.js';

const categoryLabels = { strength: 'Strength training', pilates: 'Pilates' };
const categoryOptions = [
  { value: 'all', label: 'All' },
  ...EXERCISE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] || c })),
];

export async function renderExerciseList(app) {
  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Exercise';
  container.appendChild(h);

  const intro = document.createElement('p');
  intro.textContent =
    'Beginner-friendly moves described entirely in touch and feel — no watching required. Everything here uses just a wall, the floor, a sturdy chair, or household items.';
  container.appendChild(intro);

  const category = selectField('Category', categoryOptions, { value: 'all' });
  container.appendChild(category.wrap);

  const list = document.createElement('ul');
  list.className = 'item-list';
  container.appendChild(list);

  function renderList() {
    list.innerHTML = '';
    const exercises = exercisesByCategory(category.input.value);
    for (const ex of exercises) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      const name = document.createElement('span');
      name.className = 'item-name';
      name.textContent = ex.name;
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = ` — ${ex.musclesWorked}`;
      info.append(name, meta);

      const viewBtn = navButton(`exercise/${ex.id}`, 'View', 'button-primary');
      viewBtn.setAttribute('aria-label', `View instructions for ${ex.name}`);

      li.append(info, viewBtn);
      list.appendChild(li);
    }
  }

  category.input.addEventListener('change', renderList);
  renderList();

  container.appendChild(renderTabNav('exercise'));
  app.appendChild(container);
  focusElement(h);
}

export async function renderExerciseDetail(app, id) {
  const exercise = getExerciseById(id);

  app.innerHTML = '';
  const container = document.createElement('div');

  const back = navButton('exercise', '← Back to exercises');
  container.appendChild(back);

  if (!exercise) {
    const h = document.createElement('h1');
    h.textContent = 'Exercise not found';
    container.appendChild(h);
    container.appendChild(renderTabNav('exercise'));
    app.appendChild(container);
    focusElement(h);
    return;
  }

  const h = document.createElement('h1');
  h.textContent = exercise.name;
  container.appendChild(h);

  const muscles = document.createElement('p');
  muscles.innerHTML = `<strong>Works:</strong> ${exercise.musclesWorked}`;
  container.appendChild(muscles);

  const equipment = document.createElement('p');
  equipment.innerHTML = `<strong>You’ll need:</strong> ${exercise.equipment}`;
  container.appendChild(equipment);

  const h2Steps = document.createElement('h2');
  h2Steps.textContent = 'How to do it';
  container.appendChild(h2Steps);

  const stepsList = document.createElement('ol');
  for (const step of exercise.steps) {
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
  }
  container.appendChild(stepsList);

  const h2Safety = document.createElement('h2');
  h2Safety.textContent = 'Safety notes';
  container.appendChild(h2Safety);

  const safetyList = document.createElement('ul');
  for (const note of exercise.safetyNotes) {
    const li = document.createElement('li');
    li.textContent = note;
    safetyList.appendChild(li);
  }
  container.appendChild(safetyList);

  const disclaimer = document.createElement('p');
  disclaimer.className = 'disclaimer';
  disclaimer.textContent =
    'Not medical advice. Stop and check with a doctor or physical therapist if anything causes sharp pain, dizziness, or shortness of breath beyond normal effort.';
  container.appendChild(disclaimer);

  container.appendChild(renderTabNav('exercise'));
  app.appendChild(container);
  focusElement(h);
}
