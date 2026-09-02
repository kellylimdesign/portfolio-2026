// Click-a-plant interaction for the landing hero. The windowsill
// background is bare (no plants baked in) — each plant is its own cutout,
// layered on top and positioned in JS, weather-matched to whatever
// weather.js is currently showing. Clicking a plant's hotspot slides its
// cutout left to a "detail" position, fades the background out, and fades
// in a care card (last watered / what it needs) beside it — all within
// .hero-image-wrap's own fixed-size box, so nothing below the image
// (caption, bio blurb) ever shifts. Hovering "lifts" the cutout slightly
// without opening detail view. One plant (the fiddle-leaf fig) for now;
// more hotspots can be added the same way as more plant assets land.
(function () {
  // hotspotRegion is the (generous, easy-to-click) clickable area, as a
  // fraction (0-1) of the rendered background image's box. liftAnchor is
  // the plant's normal resting spot on the sill; detailAnchor is where it
  // slides to when its card is open (same size/bottom, shifted left to
  // roughly where the windowsill's own left edge sits). Both anchors size
  // the cutout by height (not stretched to the hotspot rect), deriving
  // width from the cutout's own natural aspect ratio. All positioned in
  // JS rather than CSS % because percentage top/height on an
  // absolutely-positioned element only resolves against a containing
  // block with a *definite* height, and .hero-image-wrap's height is
  // driven by .hero-illustration's aspect-ratio, not a plain block height
  // — still indefinite for this purpose.
  // one file per weather category — see weather.js's CODES map for the
  // full list; falls back to 'clear' if weather.js hasn't resolved yet
  // (or failed) when this first runs
  //
  // ?v=3 — cache-bust: same filenames, new bytes, each time these get
  // reprocessed (v2: every weather variant re-cropped to one shared
  // bounding box per plant instead of each file's own, fixing
  // cross-weather position drift; v3: that shared box's bottom edge
  // re-anchored to the true pot-base line instead of the box's own
  // lowest content, fixing pots sinking below the sill's front edge) —
  // must match the ?v= on each plant-lift-layer's initial src in
  // index.html exactly, or syncLiftLayers() sees a string mismatch
  // against this and thinks a swap is needed on every load even when the
  // weather hasn't actually changed.
  function weatherImages(slug) {
    return {
      clear: 'assets/illustration/plant-' + slug + '-clear.webp?v=3',
      cloudy: 'assets/illustration/plant-' + slug + '-cloudy.webp?v=3',
      fog: 'assets/illustration/plant-' + slug + '-fog.webp?v=3',
      rain: 'assets/illustration/plant-' + slug + '-rain.webp?v=3',
      snow: 'assets/illustration/plant-' + slug + '-snow.webp?v=3',
      storm: 'assets/illustration/plant-' + slug + '-storm.webp?v=3',
    };
  }

  // measured directly from the background art (windowsill-clear.webp):
  // the sill's front lip, where its lit top surface meets the shaded
  // front face, sits at y=1110 of 1254px tall = 0.885. That's the line a
  // pot's own bottom edge should land on — bottom: 0.90 (used previously)
  // overshoots it by ~19px, enough for pot bases to visibly sink into the
  // sill's front face instead of resting on top of it.
  var SILL_LINE = 0.885;

  // hotspotRegion/liftAnchor centerX + height below are measured against
  // the original reference composite (all 5 pots on one sill) — same sill
  // line (SILL_LINE) for every plant, left-to-right matching the real pot
  // order. Expect these to need a round of visual tuning once actually
  // rendered, same as the fig did.
  var PLANTS = {
    yellowKalanchoe: {
      hotspotId: 'plantHotspotYellowKalanchoe',
      liftId: 'plantLiftYellowKalanchoe',
      images: weatherImages('yellow-kalanchoe'),
      alt: 'Yellow kalanchoe in a terracotta pot',
      name: 'Yellow kalanchoe',
      lastWatered: '5 days ago',
      needs: 'bright light; water when the topsoil is dry, deadhead spent blooms',
      // non-overlapping horizontal "lane" — see the note above PLANTS
      hotspotRegion: {left: 0.14, top: 0.42, width: 0.145, height: 0.50},
      liftAnchor: {centerX: 0.25, bottom: SILL_LINE, height: 0.40},
    },
    violet: {
      hotspotId: 'plantHotspotViolet',
      liftId: 'plantLiftViolet',
      images: weatherImages('violet'),
      alt: 'African violet in a terracotta pot',
      name: 'African violet',
      lastWatered: '6 days ago',
      needs: 'bright, indirect light; keep soil lightly moist, avoid wetting the leaves',
      hotspotRegion: {left: 0.29, top: 0.68, width: 0.095, height: 0.24},
      liftAnchor: {centerX: 0.32, bottom: SILL_LINE, height: 0.13},
    },
    orchid: {
      hotspotId: 'plantHotspotOrchid',
      liftId: 'plantLiftOrchid',
      images: weatherImages('orchid'),
      alt: 'Orchid in a green ridged pot',
      name: 'Orchid',
      lastWatered: '4 days ago',
      needs: 'bright, indirect light; water weekly, let roots dry between',
      hotspotRegion: {left: 0.39, top: 0.50, width: 0.135, height: 0.42},
      liftAnchor: {centerX: 0.45, bottom: SILL_LINE, height: 0.32},
    },
    kalanchoe: {
      hotspotId: 'plantHotspotKalanchoe',
      liftId: 'plantLiftKalanchoe',
      images: weatherImages('kalanchoe'),
      alt: 'Kalanchoe in a white pot',
      name: 'Kalanchoe',
      lastWatered: '6 days ago',
      needs: 'bright light; water when the topsoil is dry, deadhead spent blooms',
      hotspotRegion: {left: 0.53, top: 0.54, width: 0.155, height: 0.38},
      liftAnchor: {centerX: 0.60, bottom: SILL_LINE, height: 0.28},
    },
    fiddleFig: {
      hotspotId: 'plantHotspotFiddleFig',
      liftId: 'plantLiftFiddleFig',
      images: weatherImages('fiddle-fig'),
      alt: 'Fiddle-leaf fig in a tan pot',
      name: 'Fiddle-leaf fig',
      lastWatered: '3 days ago',
      needs: 'bright, indirect light; water when the top inch of soil is dry',
      hotspotRegion: {left: 0.69, top: 0.10, width: 0.30, height: 0.82},
      // sized by height, not width — per Kelly, should read as "almost as
      // tall as the window graphic" (~90% of its rendered height), with
      // width then derived from the cutout's own aspect ratio
      liftAnchor: {centerX: 0.77, bottom: SILL_LINE, height: 0.90},
    },
  };

  // detailAnchor — where/how big each plant is once its card is open.
  // Matches the "fixed stage, bottom-aligned" mockup Kelly approved: every
  // plant shares the same bottom line (DETAIL_BOTTOM, not a per-plant
  // center) — see .plant-info's own box below (top: 32%, bottom: 4% in
  // site.css — 1 - 0.04 = 0.96, the same line), so the plant and the text
  // sit against the exact same reference box. Only the height varies per
  // plant, biggest (fig) down to smallest (violet), giving shorter plants
  // more empty space above them rather than stretching every plant to the
  // same size — same relationship as the sill (see liftAnchor above),
  // just re-expressed for detail view since there's no visible sill once
  // the background fades out.
  //
  // Every value here must come out taller than that same plant's
  // liftAnchor.height (its resting size on the sill) — clicking a plant
  // should always make it grow, never shrink. DETAIL_BOTTOM sits at 0.96
  // (not nearer 0.90) specifically to leave the fig, whose resting height
  // is already 0.90, room to grow at all without its top edge going
  // negative (past the top of the frame). Ratios between plants otherwise
  // match the mockup (fig height in the mockup was the 1.0 reference,
  // violet ~0.56 of it, etc.), just scaled up here so the fig's own
  // growth (0.90 -> 0.92) is realistic rather than shrinking it.
  var DETAIL_BOTTOM = 0.96;
  var DETAIL_HEIGHTS = {
    fiddleFig: 0.92,
    yellowKalanchoe: 0.73,
    orchid: 0.65,       // scaled down slightly — its leaves were reaching too close to the care-card text
    kalanchoe: 0.68,
    violet: 0.56,       // scaled up slightly — looked undersized next to the care-card text
  };
  Object.keys(PLANTS).forEach(function (key) {
    var height = DETAIL_HEIGHTS[key] || 0.46;
    PLANTS[key].detailAnchor = {
      centerX: 0.22,
      bottom: DETAIL_BOTTOM,
      height: height,
    };
  });

  var SLIDE_MS = 500; // matches .plant-lift-layer's left/top/width/height transition duration

  function currentImage(plant) {
    var category = window.__weatherCategory || 'clear';
    return plant.images[category] || plant.images.clear;
  }

  var img = document.getElementById('heroIllustration');
  var wrap = img ? img.parentElement : null;
  var info = document.getElementById('plantInfo');
  var infoName = document.getElementById('plantInfoName');
  var infoWatered = document.getElementById('plantInfoWatered');
  var infoNeeds = document.getElementById('plantInfoNeeds');
  var infoBack = document.getElementById('plantInfoBack');
  if (!img || !wrap || !info || !infoName || !infoWatered || !infoNeeds || !infoBack) return;

  var activeEntry = null; // the PLANTS entry currently in detail view, if any
  var infoTimer = null;
  var entries = []; // [{plant, hotspotEl, liftEl}]

  function positionEntry(entry) {
    var hr = entry.plant.hotspotRegion;
    entry.hotspotEl.style.left = (img.offsetLeft + img.offsetWidth * hr.left) + 'px';
    entry.hotspotEl.style.top = (img.offsetTop + img.offsetHeight * hr.top) + 'px';
    entry.hotspotEl.style.width = (img.offsetWidth * hr.width) + 'px';
    entry.hotspotEl.style.height = (img.offsetHeight * hr.height) + 'px';

    if (!entry.liftEl) return;
    var la = entry === activeEntry ? entry.plant.detailAnchor : entry.plant.liftAnchor;
    var liftHeight = img.offsetHeight * la.height;
    var natural = entry.liftEl.naturalWidth && entry.liftEl.naturalHeight
      ? entry.liftEl.naturalWidth / entry.liftEl.naturalHeight
      : 0.875; // fallback ratio (width/height) if the image hasn't loaded/decoded yet
    var liftWidth = liftHeight * natural;
    var centerX = img.offsetLeft + img.offsetWidth * la.centerX;
    var bottomY = img.offsetTop + img.offsetHeight * la.bottom;
    entry.liftEl.style.width = liftWidth + 'px';
    entry.liftEl.style.height = liftHeight + 'px';
    entry.liftEl.style.left = (centerX - liftWidth / 2) + 'px';
    entry.liftEl.style.top = (bottomY - liftHeight) + 'px';
  }

  function positionAll() {
    entries.forEach(positionEntry);
  }

  // keeps each lift-layer's src matched to whatever weather is currently
  // showing — called on load and whenever weather.js reports a change.
  // Works the same whether a plant is resting on the sill or open in
  // detail view, since the cutout (not the background image) is always
  // what's actually showing the plant.
  function syncLiftLayers() {
    entries.forEach(function (entry) {
      if (!entry.liftEl) return;
      var wanted = currentImage(entry.plant);
      if (entry.liftEl.getAttribute('src') !== wanted) {
        entry.liftEl.src = wanted;
        entry.liftEl.addEventListener('load', function onLoad() {
          entry.liftEl.removeEventListener('load', onLoad);
          positionEntry(entry);
        });
      }
    });
  }

  function showPlant(entry) {
    if (activeEntry === entry) return;
    clearTimeout(infoTimer);
    info.classList.remove('show');
    activeEntry = entry;

    infoName.textContent = entry.plant.name;
    infoWatered.textContent = entry.plant.lastWatered;
    infoNeeds.textContent = entry.plant.needs;

    wrap.classList.add('detail-open');
    entries.forEach(function (e) {
      e.hotspotEl.hidden = true;
      // marks which lift-layer .hero-image-wrap.detail-open should leave
      // alone — every other one fades out along with the background
      if (e.liftEl) e.liftEl.classList.toggle('active-detail', e === entry);
    });
    positionAll(); // slides the active plant to its detailAnchor (CSS transition)

    // card fades in only once the slide has actually arrived, not
    // simultaneously with it
    infoTimer = setTimeout(function () {
      info.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { info.classList.add('show'); });
      });
    }, SLIDE_MS);
  }

  function showWindow() {
    if (!activeEntry) return;
    clearTimeout(infoTimer);
    info.classList.remove('show');
    infoTimer = setTimeout(function () { info.hidden = true; }, 350);

    activeEntry = null;
    wrap.classList.remove('detail-open');
    entries.forEach(function (e) {
      e.hotspotEl.hidden = false;
      if (e.liftEl) e.liftEl.classList.remove('active-detail');
    });
    positionAll(); // slides the plant back to its normal liftAnchor
  }

  Object.keys(PLANTS).forEach(function (key) {
    var plant = PLANTS[key];
    var hotspotEl = document.getElementById(plant.hotspotId);
    var liftEl = plant.liftId ? document.getElementById(plant.liftId) : null;
    if (!hotspotEl) return;
    var entry = {plant: plant, hotspotEl: hotspotEl, liftEl: liftEl};
    entries.push(entry);

    hotspotEl.addEventListener('click', function () { showPlant(entry); });

    if (liftEl) {
      var lift = function () { liftEl.classList.add('lifted'); };
      var drop = function () { liftEl.classList.remove('lifted'); };
      hotspotEl.addEventListener('mouseenter', lift);
      hotspotEl.addEventListener('mouseleave', drop);
      hotspotEl.addEventListener('focus', lift);
      hotspotEl.addEventListener('blur', drop);
      // width/height (and therefore the lift-layer's size) depend on this
      // image's own natural dimensions, which may not be decoded yet
      if (liftEl.complete) positionEntry(entry);
      else liftEl.addEventListener('load', function () { positionEntry(entry); });
    }
  });

  infoBack.addEventListener('click', showWindow);

  window.addEventListener('weatherchange', syncLiftLayers);

  // reposition whenever the background image's rendered box changes —
  // window resize, or its src swapping to a differently-proportioned
  // illustration (weather.js's variants aren't all cropped to the exact
  // same aspect ratio, though .hero-illustration's fixed aspect-ratio
  // now keeps the box itself constant regardless)
  if (window.ResizeObserver) {
    new ResizeObserver(positionAll).observe(img);
  } else {
    window.addEventListener('resize', positionAll);
  }
  window.addEventListener('load', positionAll);
  positionAll();
})();
