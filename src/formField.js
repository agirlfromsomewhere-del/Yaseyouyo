// Shared accessible labeled-field builders. Every field gets a real
// <label for>, and an optional error message linked via aria-describedby
// + role="alert" so screen readers announce validation problems.

let idCounter = 0;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function attachError(wrap, input, id) {
  const errorId = `${id}-error`;
  const error = document.createElement('p');
  error.id = errorId;
  error.className = 'field-error';
  error.setAttribute('role', 'alert');
  error.hidden = true;
  wrap.appendChild(error);
  return {
    show(message) {
      error.textContent = message;
      error.hidden = false;
      input.setAttribute('aria-describedby', errorId);
      input.setAttribute('aria-invalid', 'true');
    },
    clear() {
      error.hidden = true;
      error.textContent = '';
      input.removeAttribute('aria-describedby');
      input.removeAttribute('aria-invalid');
    },
  };
}

export function textField(labelText, { type = 'text', value = '', id, hint } = {}) {
  const fieldId = id || nextId('field');
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const label = document.createElement('label');
  label.setAttribute('for', fieldId);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = type;
  input.id = fieldId;
  input.value = value;
  if (type === 'number') {
    input.inputMode = 'decimal';
  }

  wrap.append(label);
  if (hint) {
    const hintEl = document.createElement('p');
    hintEl.className = 'field-hint';
    hintEl.id = `${fieldId}-hint`;
    hintEl.textContent = hint;
    wrap.append(hintEl);
    input.setAttribute('aria-describedby', hintEl.id);
  }
  wrap.append(input);
  const error = attachError(wrap, input, fieldId);

  return { wrap, input, error };
}

export function selectField(labelText, options, { value, id } = {}) {
  const fieldId = id || nextId('field');
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const label = document.createElement('label');
  label.setAttribute('for', fieldId);
  label.textContent = labelText;

  const select = document.createElement('select');
  select.id = fieldId;
  for (const opt of options) {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    select.appendChild(optionEl);
  }
  if (value != null) select.value = value;

  wrap.append(label, select);
  const error = attachError(wrap, select, fieldId);

  return { wrap, input: select, error };
}
