// Live NYC weather for the landing page hero — pulls current conditions
// from Open-Meteo (open-meteo.com), no API key required. Updates the hero
// blurb's "...where it's currently [x]" clause and swaps the windowsill
// illustration to a weather-matched variant, if one exists.
//
// Fails silently and leaves the page exactly as it renders without JS: no
// weather clause, default illustration. A portfolio site should never look
// broken because a third-party API had a bad day.
(function () {
  var NYC_LAT = 40.7128;
  var NYC_LON = -74.006;

  // WMO weather code (the standard Open-Meteo's `weather_code` uses) ->
  // {label, category}. `label` is the word used in the hero sentence;
  // `category` picks the illustration file
  // (assets/illustration/windowsill-{category}.webp). Grouped coarser than
  // the full WMO table since the illustration only needs to distinguish a
  // handful of visual moods, not every WMO nuance.
  var CODES = {
    0: {label: 'clear', category: 'clear'},
    1: {label: 'mostly clear', category: 'clear'},
    2: {label: 'partly cloudy', category: 'cloudy'},
    3: {label: 'overcast', category: 'cloudy'},
    45: {label: 'foggy', category: 'fog'},
    48: {label: 'foggy', category: 'fog'},
    51: {label: 'drizzling', category: 'rain'},
    53: {label: 'drizzling', category: 'rain'},
    55: {label: 'drizzling', category: 'rain'},
    56: {label: 'freezing drizzle', category: 'rain'},
    57: {label: 'freezing drizzle', category: 'rain'},
    61: {label: 'rainy', category: 'rain'},
    63: {label: 'rainy', category: 'rain'},
    65: {label: 'rainy', category: 'rain'},
    66: {label: 'freezing rain', category: 'rain'},
    67: {label: 'freezing rain', category: 'rain'},
    71: {label: 'snowing', category: 'snow'},
    73: {label: 'snowing', category: 'snow'},
    75: {label: 'snowing', category: 'snow'},
    77: {label: 'snowing', category: 'snow'},
    80: {label: 'rainy', category: 'rain'},
    81: {label: 'rainy', category: 'rain'},
    82: {label: 'rainy', category: 'rain'},
    85: {label: 'snowing', category: 'snow'},
    86: {label: 'snowing', category: 'snow'},
    95: {label: 'stormy', category: 'storm'},
    96: {label: 'stormy', category: 'storm'},
    99: {label: 'stormy', category: 'storm'},
  };
  var DEFAULT_ENTRY = {label: 'mild', category: 'clear'};

  // every illustration category — also drives the #weatherToggle testing
  // button's cycle order below
  var CATEGORIES = ['clear', 'cloudy', 'fog', 'rain', 'snow', 'storm'];

  // set once a test override (query param or the toggle button) is used,
  // so the real API response — which may still be in flight, or could
  // land moments after a manual click — never stomps back over it
  var manualOverride = false;

  // required illustration files, one per category above — drop these in
  // at assets/illustration/windowsill-<category>.webp:
  //   clear, cloudy, fog, rain, snow, storm
  // Preloads the candidate file before touching the visible <img>, so a
  // missing file just leaves the default windowsill-clear.webp in place
  // instead of flashing a broken image.
  //
  // window.__weatherCategory + the 'weatherchange' event are how
  // plants.js (a separate, independent script) picks the matching
  // weather-tinted plant layer for whatever's currently showing here —
  // set/dispatched only once the illustration swap actually succeeds, so
  // the two never disagree about which weather is showing.
  function applyIllustration(category) {
    var img = document.getElementById('heroIllustration');
    if (!img) return;
    // ?v=3 — cache-bust: same filenames, new bytes, whenever these get
    // reprocessed (v2 was the plant-free background swap; v3 re-cropped
    // every weather variant to one shared bounding box per group instead
    // of each file's own, since independent per-file alpha crops meant
    // each weather category came out a different size and drifted out of
    // alignment with the others — see the plant asset pipeline notes).
    var candidate = 'assets/illustration/windowsill-' + category + '.webp?v=3';
    var test = new Image();
    test.onload = function () {
      img.src = candidate;
      window.__weatherCategory = category;
      window.dispatchEvent(new CustomEvent('weatherchange', {detail: {category: category}}));
    };
    test.src = candidate;
  }

  function applyText(tempF, entry) {
    var el = document.getElementById('weatherClause');
    if (!el) return;
    el.textContent = ', where it’s currently ' + Math.round(tempF) + '°F and ' + entry.label + '.';
  }

  // --- #weatherToggle testing aid — temporary, remove alongside the
  // button + .weather-toggle CSS once weather theming is signed off ---
  function applyTestText(category) {
    var el = document.getElementById('weatherClause');
    if (!el) return;
    // reuses whichever CODES label maps to this category, just for a
    // sentence that reads naturally — no real temperature to show here
    var label = category;
    Object.keys(CODES).some(function (code) {
      if (CODES[code].category === category) { label = CODES[code].label; return true; }
      return false;
    });
    el.textContent = ', where it’s currently ' + label + ' (test).';
  }

  function setTestWeather(category) {
    manualOverride = true;
    applyIllustration(category);
    applyTestText(category);
    var btn = document.getElementById('weatherToggle');
    if (btn) btn.textContent = 'Weather: ' + category.charAt(0).toUpperCase() + category.slice(1) + ' (click to cycle)';
  }

  var forcedWeather = new URLSearchParams(location.search).get('weather');
  if (forcedWeather && CATEGORIES.indexOf(forcedWeather) !== -1) {
    setTestWeather(forcedWeather);
  }

  var weatherToggle = document.getElementById('weatherToggle');
  if (weatherToggle) {
    weatherToggle.addEventListener('click', function () {
      var current = CATEGORIES.indexOf(window.__weatherCategory || 'clear');
      setTestWeather(CATEGORIES[(current + 1) % CATEGORIES.length]);
    });
  }
  // --- end testing aid ---

  var url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + NYC_LAT + '&longitude=' + NYC_LON
    + '&current=temperature_2m,weather_code'
    + '&temperature_unit=fahrenheit&timezone=America%2FNew_York';

  // ?weather=<category> skips the real fetch entirely — no point making
  // the network call just to have its result thrown away by the guard
  // below once it lands
  if (!manualOverride) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('weather fetch failed: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        // a manual test click could have landed while this was in flight
        if (manualOverride) return;
        var current = data && data.current;
        if (!current || typeof current.temperature_2m !== 'number') return;
        var entry = CODES[current.weather_code] || DEFAULT_ENTRY;
        applyText(current.temperature_2m, entry);
        applyIllustration(entry.category);
      })
      .catch(function () {
        // no weather clause, default illustration — see file header
      });
  }
})();
