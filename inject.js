// inject.js — runs in the REAL page context (not the isolated content world)
// Reads the target timezone from the script tag's data-tz attribute
// so no inline code is needed (bypasses CSP restrictions)

(function() {
  const script = document.currentScript || document.getElementById('__tz_spoofer');
  const tz = script ? script.getAttribute('data-tz') : null;
  if (!tz) return;

  // Compute UTC offset in minutes for the target timezone
  function getOffsetMinutes(timezone) {
    const now = new Date();
    const utcMs = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzMs  = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    return (tzMs - utcMs) / 60000;
  }

  const offsetMins = getOffsetMinutes(tz);

  // 1. getTimezoneOffset — inverted by JS spec (negative = east of UTC)
  Date.prototype.getTimezoneOffset = function() {
    return -offsetMins;
  };

  // 2. Local time getters — shift UTC time by the target offset
  const getters = {
    getHours:        d => new Date(d.getTime() + offsetMins * 60000).getUTCHours(),
    getMinutes:      d => new Date(d.getTime() + offsetMins * 60000).getUTCMinutes(),
    getSeconds:      d => new Date(d.getTime() + offsetMins * 60000).getUTCSeconds(),
    getDay:          d => new Date(d.getTime() + offsetMins * 60000).getUTCDay(),
    getDate:         d => new Date(d.getTime() + offsetMins * 60000).getUTCDate(),
    getMonth:        d => new Date(d.getTime() + offsetMins * 60000).getUTCMonth(),
    getFullYear:     d => new Date(d.getTime() + offsetMins * 60000).getUTCFullYear(),
    getMilliseconds: d => new Date(d.getTime() + offsetMins * 60000).getUTCMilliseconds(),
  };

  Object.entries(getters).forEach(([method, fn]) => {
    Date.prototype[method] = function() { return fn(this); };
  });

  // 3. Locale display methods
  ['toLocaleString', 'toLocaleDateString', 'toLocaleTimeString',
   'toString', 'toTimeString'].forEach(method => {
    const orig = Date.prototype[method];
    Date.prototype[method] = function(locale, options = {}) {
      return orig.call(this, locale ?? 'en-US', { ...options, timeZone: tz });
    };
  });

  // 4. Intl.DateTimeFormat
  const OrigIntl = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(locale, options = {}) {
    return new OrigIntl(locale, { ...options, timeZone: tz });
  };
  Intl.DateTimeFormat.prototype = OrigIntl.prototype;
  Object.defineProperty(Intl, 'DateTimeFormat', {
    value: Intl.DateTimeFormat, writable: true, configurable: true
  });

  console.log(`[TZ Spoofer] Active → ${tz} (UTC${offsetMins >= 0 ? '+' : ''}${offsetMins / 60})`);
})();
