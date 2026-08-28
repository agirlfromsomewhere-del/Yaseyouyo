import { renderProfileForm } from './profileForm.js';

export async function renderOnboarding(app, { onSaved }) {
  app.innerHTML = '';
  const container = document.createElement('div');
  app.appendChild(container);

  renderProfileForm(container, {
    existing: null,
    heading: 'Let’s set up your plan',
    onSaved,
  });
}
