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

// Apply timezone and refresh tab
applyBtn.addEventListener('click', async () => {
  const tz      = tzSelect.value;
  const enabled = enabledCb.checked;

  // 1. Save the new settings
  await chrome.storage.local.set({ timezone: tz, enabled });

  // 2. Update the UI
  status.textContent = tz
    ? `✓ Applied: ${tz}. Refreshing...`
    : '✓ Reverted to system. Refreshing...';

  // 3. Reload the active tab so changes take effect
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      await chrome.tabs.reload(tabs[0].id);
    }
  } catch (err) {
    console.error("Failed to reload tab:", err);
    status.textContent = "Saved, but failed to refresh tab.";
  }

  // 4. Close the popup
  setTimeout(() => window.close(), 900);
});