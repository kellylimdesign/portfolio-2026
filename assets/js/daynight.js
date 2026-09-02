// Adds a sense of time of day to the landing hero — checks the current
// hour in New York (not the visitor's own local time, since the scene is
// specifically Kelly's NYC window) and sets body[data-daypart] to one of
// five phases, which the CSS uses to dim/warm/cool the windowsill + plant
// illustrations differently per phase. No new art assets needed — see
// .hero-illustration / .plant-lift-layer's --daynight-filter custom
// property in site.css.
//
// Evaluated once on load, not on a timer — a portfolio page doesn't need
// to re-theme itself under someone's cursor, and this avoids a jarring
// mid-visit shift right at a phase boundary. The #dayNightToggle button
// (index.html) is a temporary testing aid on top of that — remove it,
// this file's toggle wiring, and the CSS's .daynight-toggle rules
// together once the look is signed off.
(function () {
  // ordered so the toggle button can just step through them in sequence,
  // matching the order they'd actually occur in across a real day
  var PHASES = ['night', 'earlyMorning', 'sunrise', 'day', 'sunset'];
  var LABELS = {
    night: 'Night',
    earlyMorning: 'Early morning',
    sunrise: 'Sunrise',
    day: 'Day',
    sunset: 'Sunset',
  };

  function setPhase(phase) {
    if (PHASES.indexOf(phase) === -1) phase = 'day';
    document.body.dataset.daypart = phase;
    var btn = document.getElementById('dayNightToggle');
    if (btn) btn.textContent = 'Time: ' + LABELS[phase] + ' (click to cycle)';
  }

  // hour -> phase, roughly matching NYC's real sunrise/sunset swing across
  // the year better than a flat 6am/6pm cutoff, without needing an actual
  // sunrise/sunset calculation for a decorative effect like this
  function phaseForHour(hour) {
    if (hour < 5 || hour >= 20) return 'night';
    if (hour < 6.5) return 'earlyMorning';
    if (hour < 8) return 'sunrise';
    if (hour < 18) return 'day';
    return 'sunset'; // 18:00-20:00
  }

  // ?time=<phase> forces the initial state for testing, since the real
  // NYC clock makes every phase hard to eyeball on demand
  var forced = new URLSearchParams(location.search).get('time');
  if (forced && PHASES.indexOf(forced) !== -1) {
    setPhase(forced);
  } else {
    var hour;
    try {
      hour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      }).format(new Date()));
    } catch (e) {
      hour = NaN; // Intl/timeZone support missing — leave the page in its default (day) look
    }
    setPhase(isNaN(hour) ? 'day' : phaseForHour(hour));
  }

  var toggle = document.getElementById('dayNightToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = PHASES.indexOf(document.body.dataset.daypart);
      setPhase(PHASES[(current + 1) % PHASES.length]);
    });
  }
})();
