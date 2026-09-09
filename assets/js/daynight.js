// Adds a sense of time of day to the landing hero — checks the current
// hour in New York (not the visitor's own local time, since the scene is
// specifically Kelly's NYC window) and sets body[data-daypart] to one of
// five phases, which the CSS uses to dim/warm/cool the windowsill + plant
// illustrations differently per phase. No new art assets needed for the
// plants — see .plant-lift-layer's --daynight-filter custom property in
// site.css. Night is the one phase with real dedicated art instead (see
// weather.js's window.__applyHeroIllustration).
//
// Evaluated once on load, not on a timer — a portfolio page doesn't need
// to re-theme itself under someone's cursor, and this avoids a jarring
// mid-visit shift right at a phase boundary.
(function () {
  var PHASES = ['night', 'earlyMorning', 'sunrise', 'day', 'sunset'];

  function setPhase(phase) {
    if (PHASES.indexOf(phase) === -1) phase = 'day';
    var changed = document.body.dataset.daypart !== phase;
    document.body.dataset.daypart = phase;
    // re-picks the hero illustration for the new phase (day art vs.
    // night's own dedicated art — see weather.js) whenever the phase
    // actually changes after that first call. window.__applyHeroIllustration
    // won't exist yet on this very first call (weather.js, which defines
    // it, hasn't run yet — script order is daynight.js then weather.js),
    // but that's fine: weather.js makes its own initial illustration call
    // moments later and reads document.body.dataset.daypart (already set
    // above) fresh at that point, so the first paint is correct either way.
    if (changed && window.__applyHeroIllustration) window.__applyHeroIllustration();
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
})();
