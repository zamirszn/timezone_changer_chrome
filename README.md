# 🌍 Timezone Changer — Chrome Extension

**For educational purposes only**

A Chrome extension that changes your browser's timezone so websites see you as being in a different location. Works best paired with a VPN set to the same region.

---

## What It Does

When you select a timezone, the extension overrides every JavaScript date API in the page so websites read your chosen timezone instead of your real one. This affects:

- `new Date().getHours()` — returns the correct local hour for your chosen timezone
- `new Date().getTimezoneOffset()` — returns the correct UTC offset
- `Intl.DateTimeFormat` — formats dates and times in your chosen timezone
- `toLocaleString()`, `toLocaleDateString()`, `toLocaleTimeString()` — all formatted correctly
- World clocks, booking sites, scheduling tools, and most dashboards

---

## What It Does NOT Do

- Change your IP address (use a VPN for that)
- Affect server-side rendered content (time already baked into the HTML)
- Change the clock shown in Chrome's own UI
- Affect `Date.now()` — this always returns real UTC milliseconds, which is correct behaviour

For full location spoofing, run this extension alongside a VPN set to the same country.

---

## Files

```
timezone-extension/
├── manifest.json     — Extension config, permissions, and CSP settings
├── background.js     — Service worker: persists settings, pushes TZ to all tabs
├── content.js        — Runs on every page, injects the override script
├── inject.js         — The actual Date/Intl override (runs in page context)
├── popup.html        — The UI with 420 timezones grouped by region
├── popup.js          — Handles saving and applying the selected timezone
└── README.md         — This file
```

---

## Installation

**You do not need to publish this to the Chrome Web Store.** Load it directly from your computer.

### Step 1 — Unzip

Unzip the downloaded file. You should get a folder called `timezone-extension` containing 7 files.

### Step 2 — Open Chrome Extensions

Type this in your Chrome address bar and press Enter:

```
chrome://extensions
```

### Step 3 — Enable Developer Mode

Toggle the **Developer mode** switch in the top-right corner of the page. It turns blue when on.

### Step 4 — Load the Extension

Click **Load unpacked**, then select the `timezone-extension` folder (the one containing `manifest.json`). Do not select the zip file — select the unzipped folder.

### Step 5 — Pin It

Click the puzzle piece icon (🧩) in the Chrome toolbar, find **Timezone Spoofer**, and click the pin icon so it stays visible in your toolbar.

---

## How to Use

1. Click the 🌍 icon in your toolbar
2. Use the search box to find a timezone by city or region name (e.g. "Tokyo", "Lagos", "New York")
3. Select the timezone from the list
4. Click **Apply Timezone**
5. Refresh the page you want to test

The toggle switch at the bottom lets you quickly turn spoofing on/off without changing your selected timezone.

---

## How to Test It's Working

Open any website, press **F12** to open DevTools, click the **Console** tab, and run:

```js
// Should show your chosen timezone
Intl.DateTimeFormat().resolvedOptions().timeZone
```

```js
// Should show the current hour in your chosen timezone
new Date().getHours()
```

```js
// Confirms the override is active (should NOT say "native code")
Date.prototype.getTimezoneOffset.toString()
```

You should also see this line in the console automatically when the page loads:

```
[TZ Spoofer] Active → Asia/Tokyo (UTC+9)
```

### Good Sites to Test On

| Site | What to check |
|---|---|
| `time.is` | Live clock — should show your spoofed city's time |
| `browserleaks.com/javascript` | Lists the timezone Chrome is reporting |
| `whatismytimezone.com` | Detects and displays your timezone |
| `worldtimeserver.com` | Compares times across zones |

---

## Updating the Extension

If you download a new version of the zip:

1. Unzip the new file
2. Go to `chrome://extensions`
3. Find the Timezone Spoofer card
4. Click the **refresh icon** (↻) on the card — do not remove and re-add
5. Refresh any open tabs you want to test

---

## Troubleshooting

### Nothing changed after applying

You must refresh the page after clicking Apply. The injection runs on page load, not instantly.

### Console shows a CSP error

Some sites block script injection via Content Security Policy. This version of the extension uses a file-based injection (`inject.js`) which bypasses most CSP restrictions. If you still see errors, the site has an extremely strict policy — try `time.is` instead to confirm the extension itself is working.

### Timezone name is right but hours are wrong

This can happen across DST boundaries. Reload the page — the offset is recalculated fresh on each page load.

### Extension shows errors on `chrome://extensions`

Click the red **Errors** button on the extension card to see details. Common causes:

- You loaded the zip file instead of the unzipped folder
- A file is missing — make sure all 6 files are in the folder
- You edited a file and introduced a syntax error — check `inject.js` and `content.js`

### Works on some sites but not others

Sites that determine your location from your IP address (Google, YouTube, streaming services) won't be affected by the extension alone. Use a VPN set to the same region as your chosen timezone for those.

---

## How It Works (Technical)

Chrome extensions run content scripts in an "isolated world" — they share the page's DOM but not its `window` object. To override `Date` and `Intl` for the page's own JavaScript, you have to inject a `<script>` tag into the real page.

Strict sites block inline script injection via CSP. This extension works around that by:

1. Creating a `<script>` tag with `src` pointing to `inject.js` (a file inside the extension)
2. Passing the timezone via a `data-tz` attribute instead of inline code
3. Declaring `inject.js` as a `web_accessible_resource` in `manifest.json` so Chrome allows pages to load it

The extension then overrides these APIs in the page's real JavaScript context:

- `Date.prototype.getTimezoneOffset` — returns the spoofed UTC offset
- `Date.prototype.getHours/Minutes/Seconds/Date/Month/FullYear` — all shifted to the target timezone
- `Date.prototype.toLocaleString` and friends — forced to format in the target timezone
- `Intl.DateTimeFormat` — always initialised with the target timezone

The timezone is stored in `chrome.storage.local` so it persists across browser restarts and is accessible from all parts of the extension (popup, background worker, content scripts).

---

## Timezones Included

420 timezones covering all IANA regions:

| Region | Count |
|---|---|
| Africa | 52 |
| Americas | 111 |
| Antarctica | 11 |
| Arctic | 1 |
| Asia | 72 |
| Atlantic | 10 |
| Australia | 12 |
| Europe | 62 |
| Indian Ocean | 11 |
| Pacific | 36 |
| UTC | 1 |

All timezone values use the standard IANA format (e.g. `America/New_York`, `Asia/Tokyo`) which is what browsers natively understand.

---

## Permissions Used

| Permission | Why |
|---|---|
| `storage` | Save your chosen timezone across sessions |
| `tabs` | Push timezone updates to all open tabs when you change it |
| `scripting` | Inject the override into pages |
| `host_permissions: <all_urls>` | Apply to every website you visit |

---

*Built for use with a VPN. For development, testing, and timezone-aware browsing.*
