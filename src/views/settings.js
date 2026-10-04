import { getProfile, getLatestWeight, initDB } from '../db.js';
import { renderProfileForm } from './profileForm.js';
import { renderTabNav } from '../tabNav.js';
import { renderDashboard } from './dashboard.js';
import { focusElement, announce } from '../a11y.js';
import { notificationsSupported, notificationPermission, requestNotificationPermission } from '../notify.js';

export async function renderSettings(app) {
  const profile = await getProfile();
  const latestWeight = await getLatestWeight();

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Settings';
  container.appendChild(h);

  const h2Profile = document.createElement('h2');
  h2Profile.textContent = 'Profile';
  container.appendChild(h2Profile);

  const profileContainer = document.createElement('div');
  container.appendChild(profileContainer);

  renderProfileForm(profileContainer, {
    existing: profile,
    heading: null,
    currentWeightKg: latestWeight?.weightKg,
    onSaved: () => {
      renderDashboard(app);
    },
  });

  const h2Notify = document.createElement('h2');
  h2Notify.textContent = 'Reminders';
  container.appendChild(h2Notify);

  const notifyP = document.createElement('p');
  if (!notificationsSupported()) {
    notifyP.textContent = 'This browser does not support notifications.';
  } else if (notificationPermission() === 'granted') {
    notifyP.textContent = 'Reminders are enabled (only while this app is open in your browser).';
  } else if (notificationPermission() === 'denied') {
    notifyP.textContent = 'Reminders are blocked in your browser settings.';
  } else {
    notifyP.textContent = 'Reminders are off.';
  }
  container.appendChild(notifyP);

  if (notificationsSupported() && notificationPermission() === 'default') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button-primary';
    btn.textContent = 'Enable reminders';
    btn.addEventListener('click', async () => {
      await requestNotificationPermission();
      renderSettings(app);
    });
    container.appendChild(btn);
  }

  const h2Data = document.createElement('h2');
  h2Data.textContent = 'Your data';
  container.appendChild(h2Data);

  const dataP = document.createElement('p');
  dataP.textContent = 'All your data stays on this device only, in your browser’s local storage. Nothing is sent anywhere.';
  container.appendChild(dataP);

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'button-danger';
  clearBtn.textContent = 'Clear all data';
  container.appendChild(clearBtn);

  let confirming = false;
  clearBtn.addEventListener('click', async () => {
    if (!confirming) {
      confirming = true;
      clearBtn.textContent = 'Are you sure? Click again to permanently delete everything';
      return;
    }
    const db = await initDB();
    await Promise.all(
      ['profile', 'goal', 'weightLog', 'foodLog', 'supportLog', 'customFoods'].map((store) => db.clear(store))
    );
    announce('All data cleared.');
    renderDashboard(app);
  });

  container.appendChild(renderTabNav('settings'));
  app.appendChild(container);
  focusElement(h);
}
