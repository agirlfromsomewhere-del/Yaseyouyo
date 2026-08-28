import './style.css';
import { renderDashboard } from './views/dashboard.js';
import { renderWeightLog } from './views/weightLog.js';
import { renderFoodLog } from './views/foodLog.js';
import { renderFoodSuggestions } from './views/foodSuggestions.js';
import { renderGoal } from './views/goal.js';
import { renderSettings } from './views/settings.js';
import { initAnnouncer } from './a11y.js';

const app = document.getElementById('app');

async function router() {
  const hash = window.location.hash.replace(/^#\/?/, '');

  if (hash === 'weight') {
    await renderWeightLog(app);
  } else if (hash === 'food') {
    await renderFoodLog(app);
  } else if (hash === 'suggestions') {
    await renderFoodSuggestions(app);
  } else if (hash === 'goal') {
    await renderGoal(app);
  } else if (hash === 'settings') {
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
