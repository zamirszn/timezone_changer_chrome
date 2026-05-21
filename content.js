// content.js — Runs at document_start in every page

function injectScript(tz) {
  const existing = document.getElementById('__tz_spoofer');
  if (existing) existing.remove();

  if (!tz) return; // empty = revert, nothing to inject

  const script = document.createElement('script');
  script.id = '__tz_spoofer';

  // Pass the timezone via data attribute — no inline code needed
  // This is what bypasses the Content Security Policy block
  script.setAttribute('data-tz', tz);

  // Point src at our extension file instead of using inline textContent
  // CSP allows scripts from chrome-extension:// origins
  script.src = chrome.runtime.getURL('inject.js');

  (document.head || document.documentElement).appendChild(script);
}

// On page load, apply saved timezone
chrome.storage.local.get(['timezone', 'enabled'], ({ timezone, enabled }) => {
  if (enabled && timezone) injectScript(timezone);
});

// React to live changes pushed from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_TZ') injectScript(msg.timezone);
});
