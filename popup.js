// popup.js

const tzSelect  = document.getElementById('tz');
const searchBox = document.getElementById('search');
const enabledCb = document.getElementById('enabled');
const applyBtn  = document.getElementById('apply');
const status    = document.getElementById('status');

// Restore saved settings when popup opens
chrome.storage.local.get(['timezone', 'enabled'], ({ timezone, enabled }) => {
  if (timezone) tzSelect.value = timezone;
  enabledCb.checked = enabled !== false;
});

// Live search filter
searchBox.addEventListener('input', () => {
  const q = searchBox.value.toLowerCase();
  const options = tzSelect.querySelectorAll('option');
  const groups  = tzSelect.querySelectorAll('optgroup');

  options.forEach(opt => {
    if (!opt.value) return; // keep the default option always
    opt.hidden = !opt.textContent.toLowerCase().includes(q);
  });

  // Hide empty optgroups
  groups.forEach(g => {
    const visible = [...g.querySelectorAll('option')].some(o => !o.hidden);
    g.hidden = !visible;
  });
});

applyBtn.addEventListener('click', async () => {
  const tz      = tzSelect.value;
  const enabled = enabledCb.checked;

  await chrome.storage.local.set({ timezone: tz, enabled });

  status.textContent = tz
    ? `✓ Applied: ${tz}`
    : '✓ Reverted to system timezone';

  setTimeout(() => window.close(), 900);
});
