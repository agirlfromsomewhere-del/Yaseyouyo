import './style.css';
import { renderDashboard } from './views/dashboard.js';
import { renderWeightLog } from './views/weightLog.js';
import { renderFoodLog } from './views/foodLog.js';
import { renderFoodSuggestions } from './views/foodSuggestions.js';
import { renderGoal } from './views/goal.js';
import { renderSettings } from './views/settings.js';
import { renderExerciseList, renderExerciseDetail } from './views/exercises.js';
import { initAnnouncer } from './a11y.js';

const app = document.getElementById('app');

async function router() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'weight') {
    await renderWeightLog(app);
  } else if (parts[0] === 'food') {
    await renderFoodLog(app);
  } else if (parts[0] === 'suggestions') {
    await renderFoodSuggestions(app);
  } else if (parts[0] === 'exercise' && parts[1]) {
    await renderExerciseDetail(app, parts[1]);
  } else if (parts[0] === 'exercise') {
    await renderExerciseList(app);
  } else if (parts[0] === 'goal') {
    await renderGoal(app);
  } else if (parts[0] === 'settings') {
    await renderSettings(app);
  } else {
    await renderDashboard(app);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  initAnnouncer();
  router();
});

if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
