// Internal navigation uses real <button> elements (hash-based single-page
// routing — nothing meaningful to open in a new tab).
export function navButton(hash, text, className) {
  const btn = document.createElement('button');
  btn.type = 'button';
  if (className) btn.className = className;
  btn.textContent = text;
  btn.addEventListener('click', () => {
    window.location.hash = hash;
  });
  return btn;
}
