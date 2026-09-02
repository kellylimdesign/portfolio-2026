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

  // required illustration files, one per category above — drop these in
  // at assets/illustration/windowsill-<category>.webp:
  //   clear, cloudy, fog, rain, snow, storm
  // Preloads the candidate file before touching the visible <img>, so a
  // missing file just leaves the default windowsill.webp in place instead
  // of flashing a broken image.
  function applyIllustration(category) {
    var img = document.getElementById('heroIllustration');
    if (!img) return;
    var candidate = 'assets/illustration/windowsill-' + category + '.webp';
    var test = new Image();
    test.onload = function () { img.src = candidate; };
    test.src = candidate;
  }

  function applyText(tempF, entry) {
    var el = document.getElementById('weatherClause');
    if (!el) return;
    el.textContent = ', where it’s currently ' + Math.round(tempF) + '°F and ' + entry.label + '.';
  }

  var url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + NYC_LAT + '&longitude=' + NYC_LON
    + '&current=temperature_2m,weather_code'
    + '&temperature_unit=fahrenheit&timezone=America%2FNew_York';

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('weather fetch failed: ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var current = data && data.current;
      if (!current || typeof current.temperature_2m !== 'number') return;
      var entry = CODES[current.weather_code] || DEFAULT_ENTRY;
      applyText(current.temperature_2m, entry);
      applyIllustration(entry.category);
    })
    .catch(function () {
      // no weather clause, default illustration — see file header
    });
})();
