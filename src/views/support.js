import { FEELINGS, BREATHING_STEPS, BREATHING_CYCLES, GROUNDING_STEPS, CLOSING_MESSAGE } from '../supportContent.js';
import { addSupportCheckIn, getSupportCheckInsThisWeek } from '../db.js';
import { navButton } from '../nav.js';
import { focusElement, announce } from '../a11y.js';

export async function renderSupport(app) {
  const weekCount = (await getSupportCheckInsThisWeek()).length;

  let selectedFeeling = null;
  let tookAction = false;
  let cancelBreathing = null;
  let active = true;

  function stopOnNavigate() {
    active = false;
    if (cancelBreathing) cancelBreathing();
    window.removeEventListener('hashchange', stopOnNavigate);
  }
  window.addEventListener('hashchange', stopOnNavigate);

  app.innerHTML = '';
  const container = document.createElement('div');
  app.appendChild(container);

  function renderLanding() {
    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = 'Having a moment?';
    container.appendChild(h);

    const p = document.createElement('p');
    p.textContent =
      'Wanting to eat when you’re stressed doesn’t mean anything is wrong with you. Let’s take a minute together before you decide anything.';
    container.appendChild(p);

    if (weekCount > 0) {
      const stat = document.createElement('p');
      stat.textContent = `You’ve checked in with yourself like this ${weekCount} time${weekCount === 1 ? '' : 's'} this week.`;
      container.appendChild(stat);
    }

    const row = document.createElement('div');
    row.className = 'action-row';
    const startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'button-primary';
    startBtn.textContent = 'Let’s take a minute';
    startBtn.addEventListener('click', renderCheckin);

    const backBtn = navButton('', 'I’m okay, take me back');

    row.append(startBtn, backBtn);
    container.appendChild(row);

    focusElement(h);
  }

  function renderCheckin() {
    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = 'What’s going on right now?';
    container.appendChild(h);

    const list = document.createElement('div');
    list.className = 'action-row';
    for (const feeling of FEELINGS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'button-primary';
      btn.textContent = feeling.label;
      btn.addEventListener('click', () => {
        selectedFeeling = feeling;
        renderResponse();
      });
      list.appendChild(btn);
    }
    container.appendChild(list);
    focusElement(h);
  }

  function renderResponse() {
    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = selectedFeeling.label;
    container.appendChild(h);

    const p = document.createElement('p');
    p.textContent = selectedFeeling.response;
    container.appendChild(p);

    if (selectedFeeling.id === 'just-eat') {
      finish(false);
      return;
    }

    const row = document.createElement('div');
    row.className = 'action-row';

    const breatheBtn = document.createElement('button');
    breatheBtn.type = 'button';
    breatheBtn.className = 'button-primary';
    breatheBtn.textContent = 'Try a minute of slow breathing';
    breatheBtn.addEventListener('click', renderBreathing);

    const groundBtn = document.createElement('button');
    groundBtn.type = 'button';
    groundBtn.textContent = 'Try a grounding exercise';
    groundBtn.addEventListener('click', renderGrounding);

    const eatBtn = document.createElement('button');
    eatBtn.type = 'button';
    eatBtn.textContent = 'I’d rather just eat, and that’s fine';
    eatBtn.addEventListener('click', () => finish(false));

    row.append(breatheBtn, groundBtn, eatBtn);
    container.appendChild(row);
    focusElement(h);
  }

  function renderBreathing() {
    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = 'Slow breathing';
    container.appendChild(h);

    const status = document.createElement('p');
    status.className = 'budget-number';
    container.appendChild(status);

    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'button-primary';
    doneBtn.textContent = 'I’m done';
    doneBtn.addEventListener('click', () => {
      if (cancelBreathing) cancelBreathing();
      finish(true);
    });
    container.appendChild(doneBtn);
    focusElement(h);

    let cycle = 0;
    let stepIdx = 0;
    let timeoutId;
    let cancelled = false;

    function next() {
      if (cancelled || !active) return;
      if (cycle >= BREATHING_CYCLES) {
        finish(true);
        return;
      }
      const step = BREATHING_STEPS[stepIdx];
      status.textContent = step.phase;
      announce(step.phase);
      timeoutId = setTimeout(() => {
        stepIdx += 1;
        if (stepIdx >= BREATHING_STEPS.length) {
          stepIdx = 0;
          cycle += 1;
        }
        next();
      }, step.seconds * 1000);
    }
    cancelBreathing = () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    next();
  }

  function renderGrounding() {
    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = 'A moment of grounding';
    container.appendChild(h);

    const list = document.createElement('ol');
    for (const step of GROUNDING_STEPS) {
      const li = document.createElement('li');
      li.textContent = step;
      list.appendChild(li);
    }
    container.appendChild(list);

    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'button-primary';
    doneBtn.textContent = 'Done';
    doneBtn.addEventListener('click', () => finish(true));
    container.appendChild(doneBtn);
    focusElement(h);
  }

  async function finish(actionTaken) {
    if (!active) return;
    tookAction = actionTaken;
    await addSupportCheckIn({ feeling: selectedFeeling?.id || 'unspecified', tookAction });

    container.innerHTML = '';
    const h = document.createElement('h1');
    h.textContent = 'Whatever you choose now';
    container.appendChild(h);

    const p = document.createElement('p');
    p.textContent = CLOSING_MESSAGE;
    container.appendChild(p);

    const row = document.createElement('div');
    row.className = 'action-row';
    const foodBtn = navButton('food', 'Log food', 'button-primary');
    const homeBtn = navButton('', 'Back to Today');
    row.append(foodBtn, homeBtn);
    container.appendChild(row);
    focusElement(h);
  }

  renderLanding();
}
