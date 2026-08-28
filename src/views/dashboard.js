import { getAllFoodLog, deleteFoodEntry } from '../db.js';
import { calculateStreak } from '../streak.js';
import { getTodaysBudget } from '../budget.js';
import { renderTabNav } from '../tabNav.js';
import { renderOnboarding } from './onboarding.js';
import { navButton } from '../nav.js';
import { focusElement, announce } from '../a11y.js';
import { notificationsSupported, notificationPermission, requestNotificationPermission, maybeNudge } from '../notify.js';

export async function renderDashboard(app) {
  const budget = await getTodaysBudget();
  if (!budget) {
    await renderOnboarding(app, { onSaved: () => renderDashboard(app) });
    return;
  }
  const { latestWeight, goal, today, todaysFood, totalToday, tdee, dailyTarget, plan } = budget;

  const allFoodLog = await getAllFoodLog();
  const streak = calculateStreak(allFoodLog, dailyTarget);

  app.innerHTML = '';
  const container = document.createElement('div');

  const h = document.createElement('h1');
  h.textContent = 'Today';
  container.appendChild(h);

  if (!goal?.goalWeightKg) {
    const banner = document.createElement('div');
    banner.className = 'banner banner-warning';
    banner.innerHTML = '';
    const p = document.createElement('p');
    p.style.margin = '0';
    p.append('No goal set yet — showing your maintenance calories. ');
    const link = navButton('goal', 'Set a weight goal');
    link.className = 'button-primary';
    p.appendChild(link);
    banner.appendChild(p);
    container.appendChild(banner);
  } else if (plan && !plan.valid) {
    const banner = document.createElement('div');
    banner.className = 'banner banner-danger';
    banner.textContent = plan.error;
    container.appendChild(banner);
  } else if (plan?.warnings?.length) {
    for (const warning of plan.warnings) {
      const banner = document.createElement('div');
      banner.className = 'banner banner-warning';
      banner.textContent = warning;
      container.appendChild(banner);
    }
  }

  const remaining = Math.round(dailyTarget - totalToday);
  const budgetCard = document.createElement('div');
  budgetCard.className = 'card';

  const budgetLabel = document.createElement('p');
  budgetLabel.className = 'budget-label';
  budgetLabel.textContent = remaining >= 0 ? 'Calories remaining today' : 'Over budget today';
  budgetCard.appendChild(budgetLabel);

  const budgetNumber = document.createElement('p');
  budgetNumber.className = 'budget-number';
  budgetNumber.textContent = `${Math.abs(remaining)} kcal`;
  budgetCard.appendChild(budgetNumber);

  const track = document.createElement('div');
  track.className = 'progress-track';
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', String(Math.round(dailyTarget)));
  track.setAttribute('aria-valuenow', String(Math.round(totalToday)));
  track.setAttribute('aria-label', 'Calories eaten today vs. budget');
  const fill = document.createElement('div');
  fill.className = 'progress-fill' + (totalToday > dailyTarget ? ' over-budget' : '');
  const pct = dailyTarget > 0 ? Math.min(100, (totalToday / dailyTarget) * 100) : 0;
  fill.style.width = `${pct}%`;
  track.appendChild(fill);
  budgetCard.appendChild(track);

  const budgetDetail = document.createElement('p');
  budgetDetail.textContent = `${Math.round(totalToday)} kcal logged of ${Math.round(dailyTarget)} kcal budget`;
  budgetCard.appendChild(budgetDetail);

  container.appendChild(budgetCard);

  const streakBadge = document.createElement('p');
  streakBadge.className = 'streak-badge';
  streakBadge.textContent = streak > 0 ? `${streak}-day streak` : 'No streak yet — log today to start one';
  container.appendChild(streakBadge);

  const actionRow = document.createElement('div');
  actionRow.className = 'action-row';
  const logFoodBtn = navButton('food', 'Log food', 'button-primary');
  const logWeightBtn = navButton('weight', 'Log weight');
  actionRow.append(logFoodBtn, logWeightBtn);
  container.appendChild(actionRow);

  if (todaysFood.length) {
    const h2 = document.createElement('h2');
    h2.textContent = "Today's food";
    container.appendChild(h2);

    const list = document.createElement('ul');
    list.className = 'item-list';
    for (const entry of todaysFood) {
      const li = document.createElement('li');
      const info = document.createElement('span');
      info.innerHTML = '';
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
        renderDashboard(app);
      });

      li.append(info, removeBtn);
      list.appendChild(li);
    }
    container.appendChild(list);
  }

  const h2 = document.createElement('h2');
  h2.textContent = 'Your numbers';
  container.appendChild(h2);
  const numbers = document.createElement('p');
  numbers.innerHTML = `Maintenance (TDEE): <strong>${Math.round(tdee)} kcal/day</strong><br>Today's target: <strong>${Math.round(dailyTarget)} kcal/day</strong>` +
    (latestWeight ? `<br>Current weight: <strong>${latestWeight.weightKg.toFixed(1)} kg</strong>` : '');
  container.appendChild(numbers);

  if (notificationsSupported() && notificationPermission() === 'default') {
    const notifyCard = document.createElement('div');
    notifyCard.className = 'card';
    const p = document.createElement('p');
    p.style.marginTop = '0';
    p.textContent = 'Want a nudge if you haven’t logged food by evening? This only works while the app is open in your browser — a free static app can’t send reminders while fully closed.';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button-primary';
    btn.textContent = 'Enable reminders';
    btn.addEventListener('click', async () => {
      await requestNotificationPermission();
      renderDashboard(app);
    });
    notifyCard.append(p, btn);
    container.appendChild(notifyCard);
  }

  container.appendChild(renderTabNav(''));
  app.appendChild(container);
  focusElement(h);

  maybeNudge({ dateISO: today, hasLoggedToday: todaysFood.length > 0 });
}
