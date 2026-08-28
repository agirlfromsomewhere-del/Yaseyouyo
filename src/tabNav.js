import { navButton } from './nav.js';

const TABS = [
  { hash: '', label: 'Today' },
  { hash: 'weight', label: 'Weight' },
  { hash: 'food', label: 'Food' },
  { hash: 'suggestions', label: 'Ideas' },
  { hash: 'exercise', label: 'Exercise' },
  { hash: 'goal', label: 'Goal' },
  { hash: 'settings', label: 'Settings' },
];

export function renderTabNav(activeHash) {
  const nav = document.createElement('nav');
  nav.className = 'tab-nav';
  nav.setAttribute('aria-label', 'Main sections');

  for (const tab of TABS) {
    const btn = navButton(tab.hash, tab.label);
    if (tab.hash === activeHash) {
      btn.setAttribute('aria-current', 'page');
    }
    nav.appendChild(btn);
  }

  return nav;
}
