## Timezone Changer Extension
** For education purposes only **

Change your browser's timezone to any of 420 locations worldwide. Websites will see your chosen timezone instead of your real one. Works best paired with a VPN set to the same region.

---

## What It Does

When you select a timezone, the extension overrides every JavaScript date API in the page so websites read your chosen timezone instead of your real one:

- `new Date().getHours()` — returns the correct local hour for your chosen timezone
- `new Date().getTimezoneOffset()` — returns the correct UTC offset
- `Intl.DateTimeFormat` — formats dates and times in your chosen timezone
- `toLocaleString()`, `toLocaleDateString()`, `toLocaleTimeString()` — all formatted correctly
- World clocks, booking sites, scheduling tools, and most dashboards

---

## What It Does NOT Do

- Change your IP address — use a VPN alongside this extension for that
- Affect server-side rendered content (time already baked into the HTML before it reaches your browser)
- Change the clock shown in Chrome's own UI or your OS taskbar
- Affect `Date.now()` — this always returns real UTC milliseconds, which is correct browser behaviour

---

## Files

```
timezone-changer-extension/
├── manifest.json       — Extension config, permissions, icons, and CSP settings
├── background.js       — Service worker: persists settings, pushes TZ to all tabs
├── content.js          — Runs on every page, injects the override script
├── inject.js           — The actual Date/Intl override (runs in real page context)
├── popup.html          — The UI with 420 timezones grouped by region + search
├── popup.js            — Handles saving and applying the selected timezone
├── icons/
│   ├── icon16.png      — Toolbar icon
│   ├── icon48.png      — Extensions page icon
│   └── icon128.png     — Chrome Web Store icon
└── README.md           — This file
```

---

## Local Installation (Without the Store)

You do not need to publish to the Chrome Web Store to use this extension.

1. Unzip the downloaded file to get the `timezone-changer-extension` folder
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** on (top-right corner)
4. Click **Load unpacked** and select the `timezone-changer-extension` folder
5. Click the puzzle piece 🧩 in the toolbar and pin **Timezone Changer**

---

## How to Use

1. Click the icon in your Chrome toolbar
2. Type a city or region in the search box (e.g. "Tokyo", "Lagos", "New York")
3. Select the matching timezone from the list
4. Click **Apply Timezone**
5. Refresh the page you want to test — the override takes effect on page load

The toggle switch lets you quickly disable spoofing without losing your selected timezone.

---

## Testing It Works

Open any website, press **F12**, go to the Console tab and run:

```js
// Should show your chosen timezone name
Intl.DateTimeFormat().resolvedOptions().timeZone

// Should show the current hour in that timezone
new Date().getHours()

// Should NOT say "native code" if the override is active
Date.prototype.getTimezoneOffset.toString()
```

The console should also automatically show:
```
[TZ Changer] Active → Asia/Tokyo (UTC+9)
```

**Recommended test sites:**
- `time.is` — live clock, should match your chosen city
- `browserleaks.com/javascript` — shows exactly what timezone your browser is reporting
- `whatismytimezone.com` — detects and displays your timezone

---

## Publishing to the Chrome Web Store

### What You Need Before Submitting

| Requirement | Details |
|---|---|
| Google Developer Account | One-time $5 USD registration fee at [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole) |
| Icons | Already included: 16px, 48px, 128px PNG |
| Screenshots | At least 1 screenshot, 1280×800 or 640×400 pixels |
| Store listing description | See below |
| Privacy policy URL | Required because the extension uses `storage` permission |
| Zip file | The extension folder zipped, not the folder containing it |

---

### Step 1 — Create Your Developer Account

1. Go to [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
2. Sign in with a Google account
3. Pay the one-time **$5 registration fee**
4. Accept the developer agreement

---

### Step 2 — Prepare Your Zip File

The zip must contain the extension files directly — **not** inside a subfolder.

Correct structure inside the zip:
```
manifest.json
background.js
content.js
inject.js
popup.html
popup.js
icons/icon16.png
icons/icon48.png
icons/icon128.png
```

To create it correctly on Windows: open the `timezone-changer-extension` folder, select all files inside it, right-click → Send to → Compressed folder.

On Mac/Linux:
```bash
cd timezone-changer-extension
zip -r ../timezone-changer.zip .
```

---

### Step 3 — Take Screenshots

Chrome Web Store requires at least one screenshot at exactly **1280×800px** or **640×400px**.

Suggested screenshots to take:
1. The popup open showing the timezone list with search
2. A site like `time.is` showing the spoofed timezone in action
3. The DevTools console showing the `[TZ Changer] Active` log

---

### Step 4 — Write a Privacy Policy

The Chrome Web Store requires a privacy policy URL because the extension uses the `storage` permission. Host a simple page (GitHub Pages, Notion, or any website) with this text:

> **Timezone Changer Privacy Policy**
>
> Timezone Changer does not collect, transmit, or share any personal data.
>
> The only data stored is your selected timezone preference, saved locally in your browser using `chrome.storage.local`. This data never leaves your device and is never sent to any server.
>
> The extension does not track browsing history, collect identifiable information, or communicate with any external service.

---

### Step 5 — Submit on the Developer Console

1. Go to [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
2. Click **New Item**
3. Upload your zip file
4. Fill in the store listing:

**Store listing fields:**

| Field | Value |
|---|---|
| Name | Timezone Changer |
| Short description (132 chars max) | Change your browser timezone to any of 420 worldwide locations. Works with all JavaScript date APIs. Best paired with a VPN. |
| Detailed description | See below |
| Category | Developer Tools |
| Language | English |
| Screenshots | Your 1280×800 screenshots |
| Small promo tile | 440×280px (optional but recommended) |
| Privacy policy URL | Your hosted privacy policy page |

**Detailed description (paste this):**
```
Timezone Changer lets you set your browser's timezone to any of 420 locations worldwide — instantly, without restarting Chrome.

FEATURES
• 420 IANA timezones across all world regions
• Search by city or timezone name
• Live switching — change timezone without closing tabs
• Toggle on/off instantly
• Persists across browser restarts
• Works with all JavaScript date APIs

WHAT IT CHANGES
• Intl.DateTimeFormat — what most modern sites use
• Date.getHours(), getMinutes(), getDay(), getMonth(), getFullYear()
• Date.getTimezoneOffset()
• toLocaleString(), toLocaleDateString(), toLocaleTimeString()

BEST RESULTS
For full location matching (including IP-based detection), use this extension alongside a VPN set to the same country.

USE CASES
• Testing websites and apps in different timezones
• Working with remote teams across time zones
• Checking what time it is in another location
• Verifying timezone-dependent features during development

HOW IT WORKS
The extension injects a script into every page that overrides the browser's Date and Intl APIs. The timezone is passed via a data attribute (not inline code), so it works even on sites with strict Content Security Policies.

PERMISSIONS
• storage — saves your selected timezone between sessions
• tabs — pushes timezone updates to all open tabs when you change it
• scripting + host_permissions — injects the override into web pages
```

---

### Step 6 — Submit for Review

1. Click **Save draft** first and preview your listing
2. Click **Submit for review**
3. Google typically reviews new extensions within **1–3 business days**
4. You will receive an email when it is approved or if changes are requested

---

### Common Rejection Reasons and How to Avoid Them

| Rejection reason | How this extension handles it |
|---|---|
| Missing privacy policy | Include your hosted privacy policy URL |
| Overly broad permissions | All permissions in manifest.json are justified in the store description |
| Unclear purpose | The description clearly states what the extension does and why each permission is needed |
| Deceptive functionality | The extension does exactly what it says — no hidden behaviour |
| Missing or low quality icons | All three required sizes (16, 48, 128) are included as PNG |

---

## How It Works (Technical)

Chrome extensions run content scripts in an "isolated world" — they share the page's DOM but not its `window` object. To override `Date` and `Intl` for the page's own JavaScript, a `<script>` tag must be injected into the real page.

Strict sites block inline script injection via Content Security Policy (CSP). This extension works around that by:

1. Creating a `<script>` tag with `src` pointing to `inject.js` (a file bundled with the extension)
2. Passing the timezone via a `data-tz` attribute — no inline code is used
3. Declaring `inject.js` as a `web_accessible_resource` in `manifest.json` so Chrome allows pages to load it from the `chrome-extension://` origin, which CSP always permits

---

## Timezones Included

420 timezones across all IANA regions:

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

---

## Troubleshooting

**Nothing changed after applying** — refresh the page. The injection runs on page load.

**CSP error in console** — the file-based injection handles most CSP policies. If it still fails, the site has an exceptionally strict policy. Test on `time.is` to confirm the extension itself works.

**Hours are wrong but timezone name is right** — can happen at DST boundaries. Reload the page to recalculate.

**Works on some sites but not others** — sites using IP-based location detection (Google, YouTube, streaming) need a VPN set to the same region.

---

*For development, testing, and timezone-aware browsing.*