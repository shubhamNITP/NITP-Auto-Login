const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const autoSubmitEl = document.getElementById('autoSubmit');
const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');

// Load any previously saved values
chrome.storage.local.get(['nitUsername', 'nitPassword', 'autoSubmit'], (data) => {
  if (data.nitUsername) usernameEl.value = data.nitUsername;
  if (data.nitPassword) passwordEl.value = data.nitPassword;
  autoSubmitEl.checked = data.autoSubmit !== false; // default true
});

saveBtn.addEventListener('click', () => {
  const nitUsername = usernameEl.value.trim();
  const nitPassword = passwordEl.value;
  const autoSubmit = autoSubmitEl.checked;

  if (!nitUsername || !nitPassword) {
    statusEl.style.color = '#e76644';
    statusEl.textContent = 'Please enter both fields.';
    return;
  }

  chrome.storage.local.set({ nitUsername, nitPassword, autoSubmit }, () => {
    statusEl.style.color = '#44ac33';
    statusEl.textContent = 'Saved. Will auto-fill next time the portal opens.';
    setTimeout(() => { statusEl.textContent = ''; }, 2500);
  });
});
