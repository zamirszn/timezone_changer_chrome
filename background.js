// background.js — MV3 Service Worker

// Seed defaults on first install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timezone: '', enabled: true });
  console.log('[TZ Spoofer] Installed and ready.');
});

// When a tab starts loading, push the current TZ to it
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status !== 'loading') return;
  if (!tab.url?.startsWith('http')) return;

  const { timezone, enabled } = await chrome.storage.local.get(['timezone', 'enabled']);
  if (!enabled || !timezone) return;

  chrome.tabs.sendMessage(tabId, { type: 'SET_TZ', timezone }).catch(() => {});
});

// When storage changes, push new TZ to every open tab immediately
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local') return;
  if (!changes.timezone && !changes.enabled) return;

  const { timezone, enabled } = await chrome.storage.local.get(['timezone', 'enabled']);
  const tzToApply = enabled ? timezone : '';

  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, { type: 'SET_TZ', timezone: tzToApply }).catch(() => {});
  }
});
