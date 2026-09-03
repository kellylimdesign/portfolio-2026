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
      lastWatered: '3 days ago',
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
      lastWatered: '6 days ago',
      needs: 'bright, indirect light; refill reservoir when empty, leaving a little behind',
      hotspotRegion: {left: 0.39, top: 0.50, width: 0.135, height: 0.42},
      liftAnchor: {centerX: 0.45, bottom: SILL_LINE, height: 0.32},
    },
    kalanchoe: {
      hotspotId: 'plantHotspotKalanchoe',
      liftId: 'plantLiftKalanchoe',
      images: weatherImages('kalanchoe'),
      alt: 'Kalanchoe in a white pot',
      name: 'Kalanchoe',
      lastWatered: '3 days ago',
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
      lastWatered: '6 days ago',
      needs: 'bright, indirect light; water once a week',
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
  var galleryBack = document.getElementById('galleryBack');
  if (!img || !wrap || !info || !infoName || !infoWatered || !infoNeeds || !infoBack || !galleryBack) return;

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
    positionDecor();
  }

  // gallery-aware counterpart to positionAll() — used anywhere layout
  // changes can happen out from under the gallery (window resize, the
  // background illustration's own ResizeObserver). Without this, those
  // listeners called positionAll() unconditionally, which only knows
  // sill/detail coordinates: opening the gallery itself resizes
  // .hero-image-wrap to full-screen, which grows .hero-illustration's
  // rendered box too (width:100% up to its max-width cap) — firing the
  // ResizeObserver *while the gallery is open* and silently snapping
  // every plant back to sill positions computed against the new, much
  // bigger image box. That race (not any single deterministic order) is
  // what caused plants to intermittently land clustered/in the wrong
  // slot — the fix has to be here, not in the gallery's own code, since
  // the gallery's own positioning was never the thing that was wrong.
  // flyingEntry (whichever plant, if any, is mid-flight via
  // translateIntoNewFrame() — see showGallery()/hideGallery()) is always
  // skipped here, in both branches below. Its own position is being
  // driven by that flight's rAF-scheduled sequence; touching it here,
  // before that sequence has re-enabled its transition, would instantly
  // snap it to its target and cancel the animation before it's had a
  // chance to play — the same silent-jump failure mode as the
  // ResizeObserver race this function was originally written to fix,
  // just landing on the plant that's supposed to be the one visibly
  // moving instead of the ones that are supposed to hold still.
  function positionAllForCurrentState() {
    if (!galleryOpen) {
      entries.forEach(function (entry) {
        if (entry !== flyingEntry) positionEntry(entry);
      });
      positionDecor();
      return;
    }
    var wrapW = wrap.offsetWidth, wrapH = wrap.offsetHeight;
    GALLERY_ORDER.forEach(function (key, i) {
      var entry = entryFor(key);
      if (!entry) return;
      var anchor = galleryAnchorPx(i, wrapW, wrapH);
      positionGalleryLabels(key, anchor);
      if (entry.liftEl && entry !== flyingEntry) applyGalleryPosition(entry.liftEl, anchor);
    });
    positionDecor();
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
          // repositionForCurrentState(), not positionEntry() directly —
          // this fires whenever the weather fetch resolves, which is an
          // async network call that can land at ANY time, including
          // while the gallery is already open. positionEntry() only
          // knows about sill/detail coordinates, so calling it here
          // unconditionally would silently snap whichever plant just
          // finished loading its new weather image back to its small
          // sill position mid-gallery — see the note above that
          // function, defined further down, for the full story (this
          // was the actual cause of plants intermittently appearing
          // clustered near the old small box instead of in their
          // gallery slot).
          repositionForCurrentState(entry);
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

    hotspotEl.addEventListener('click', function () { showGallery(key); });

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

  // ---- Gallery: click-a-plant reveals all 5 in an evenly-spaced row
  // instead of just that one's own card. Reuses the exact same
  // mechanism as the single-plant detail view above (JS-computed
  // absolute left/top/width/height + the existing CSS transition on
  // .plant-lift-layer) — plants never leave .hero-image-wrap or change
  // position scheme, so the transition always has a valid starting
  // point to animate from. No transform/FLIP tricks.
  //
  // The one wrinkle: opening/closing also resizes .hero-image-wrap
  // itself (small in-page box <-> full-screen), which moves its own
  // origin instantly. Since children are positioned relative to that
  // origin, their existing left/top would suddenly describe a different
  // on-screen spot the instant that happens. translateIntoNewFrame()
  // below corrects for that in one synchronous, non-animated step —
  // measuring the plant's actual on-screen position first, then
  // re-expressing that same position in numbers valid for the wrap's
  // new box — so the animated transition that follows always starts
  // from a spot that matches where the plant visually already was, with
  // nothing to jump across.
  //
  // Only the plant being opened/returned is ever animated. The other 4
  // get their new position set while still invisible — nothing to see
  // move, so no special handling needed for them; they just fade in
  // (or reappear) already sitting correctly in place.
  var GALLERY_ORDER = Object.keys(PLANTS); // fixed sill order, left to right
  var galleryOpen = false;
  var activeGalleryKey = null; // whichever plant opened the gallery — the same one flies back on Back
  var galleryTimer = null; // the one pending setTimeout for whichever transition is in flight
  var flyingEntry = null; // whichever entry's own translateIntoNewFrame() flight is currently in progress — see positionAllForCurrentState()
  var MEDIA_SIZE = 220; // px — uniform square frame for every plant
  var SLOT_WIDTH = 260; // px — horizontal space reserved per plant (frame + room for its label)
  var SLOT_GAP = 32; // px — gap between slots
  var LABEL_GAP = 14; // px — space between a plant's frame and its name/watered text

  function entryFor(key) {
    return entries.filter(function (e) { return e.plant === PLANTS[key]; })[0];
  }

  function keyForEntry(entry) {
    return GALLERY_ORDER.filter(function (k) { return entryFor(k) === entry; })[0];
  }

  // used by syncLiftLayers() (see its own comment) so a weather-triggered
  // image reload never repositions a plant using the wrong coordinate
  // system for whatever's currently on screen
  function repositionForCurrentState(entry) {
    if (galleryOpen) {
      var key = keyForEntry(entry);
      var i = GALLERY_ORDER.indexOf(key);
      if (i !== -1) {
        var wrapW = wrap.offsetWidth, wrapH = wrap.offsetHeight;
        applyGalleryPosition(entry.liftEl, galleryAnchorPx(i, wrapW, wrapH));
        return;
      }
    }
    positionEntry(entry);
  }

  // name above, "Last watered" below — created once and repositioned
  // each time, rather than rebuilt per open/close
  var galleryLabels = {}; // key -> {nameEl, wateredEl}
  GALLERY_ORDER.forEach(function (key) {
    var plant = PLANTS[key];
    var nameEl = document.createElement('p');
    nameEl.className = 'gallery-label-name';
    nameEl.textContent = plant.name;
    var wateredEl = document.createElement('p');
    wateredEl.className = 'gallery-label-watered';
    wateredEl.textContent = 'Last watered: ' + plant.lastWatered;
    wrap.appendChild(nameEl);
    wrap.appendChild(wateredEl);
    galleryLabels[key] = {nameEl: nameEl, wateredEl: wateredEl};
  });

  // wrapW/wrapH are passed in rather than read from wrap.offsetWidth/
  // offsetHeight here directly — reading them fresh on every single call
  // within the same positioning pass risked measuring a stale, not-yet-
  // settled size for some plants and the final full-screen size for
  // others (this is what caused 3 plants to land clustered near the old
  // small box's position instead of spread across the real row).
  // Measuring once per pass and passing the same numbers to every
  // anchor computation guarantees they all agree.
  function galleryAnchorPx(index, wrapW, wrapH) {
    var totalWidth = GALLERY_ORDER.length * SLOT_WIDTH + (GALLERY_ORDER.length - 1) * SLOT_GAP;
    var rowLeft = (wrapW - totalWidth) / 2;
    var slotLeft = rowLeft + index * (SLOT_WIDTH + SLOT_GAP);
    var centerX = slotLeft + SLOT_WIDTH / 2;
    var centerY = wrapH / 2;
    return {
      left: centerX - MEDIA_SIZE / 2,
      top: centerY - MEDIA_SIZE / 2,
      width: MEDIA_SIZE,
      height: MEDIA_SIZE,
      centerX: centerX,
      frameTop: centerY - MEDIA_SIZE / 2,
      frameBottom: centerY + MEDIA_SIZE / 2,
    };
  }

  function applyGalleryPosition(liftEl, anchor) {
    liftEl.style.left = anchor.left + 'px';
    liftEl.style.top = anchor.top + 'px';
    liftEl.style.width = anchor.width + 'px';
    liftEl.style.height = anchor.height + 'px';
  }

  function positionGalleryLabels(key, anchor) {
    var l = galleryLabels[key];
    if (!l) return;
    var left = (anchor.centerX - SLOT_WIDTH / 2) + 'px';
    l.nameEl.style.left = left;
    l.nameEl.style.width = SLOT_WIDTH + 'px';
    l.wateredEl.style.left = left;
    l.wateredEl.style.width = SLOT_WIDTH + 'px';
    l.wateredEl.style.top = (anchor.frameBottom + LABEL_GAP) + 'px';
    // measured after the width above is set, so it wraps the same way
    // it will when actually shown
    l.nameEl.style.top = (anchor.frameTop - LABEL_GAP - l.nameEl.offsetHeight) + 'px';
  }

  // runs applyFn with el's left/top/width/height transition (see
  // .plant-lift-layer in site.css) switched off, so whatever position
  // change applyFn makes is instant rather than following the normal
  // 0.5s animated slide. Without this, EVERY change to left/top/width/
  // height animates automatically — CSS doesn't know an "instant" set
  // from a real move — which is exactly what made every plant in the
  // gallery look like it was sliding into place instead of only the one
  // that was actually clicked. Re-enables the transition afterward
  // (double-rAF — one isn't reliably enough for the browser to paint the
  // instant state first) via onRestored, since the same element may need
  // to animate again on some later call (e.g. the next time it's the one
  // clicked/returned).
  function withTransitionDisabled(el, applyFn, onRestored) {
    var prevTransition = el.style.transition;
    el.style.transition = 'none';
    applyFn();
    el.getBoundingClientRect(); // force layout so the instant change registers first
    // onRestored is also what kicks off the real animated move (see
    // showGallery()/hideGallery() below). If the rAF pair is ever
    // delayed or never fires, the plant would otherwise be stuck forever
    // at this instant, pre-flight position — reading as "nothing moved"
    // rather than a shorter/glitchier version of the animation. The
    // setTimeout is a safety net guaranteeing onRestored always runs;
    // 50ms is well past two real frames in any actively-rendering tab,
    // so the rAF path always wins first in normal use.
    var restored = false;
    function restore() {
      if (restored) return;
      restored = true;
      el.style.transition = prevTransition;
      if (onRestored) onRestored();
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(restore);
    });
    setTimeout(restore, 50);
  }

  // re-expresses el's CURRENT on-screen position/size as left/top/
  // width/height valid against wrap's box RIGHT NOW — call right after
  // wrap itself has just resized/repositioned, so el doesn't visually
  // jump even though the numbers needed to describe its position have
  // changed underneath it. onSettled runs once it's safe to set the
  // real animated target (i.e. once the correction above has actually
  // been painted and the transition is back on).
  function translateIntoNewFrame(el, beforeRect, onSettled) {
    var wrapRect = wrap.getBoundingClientRect();
    withTransitionDisabled(el, function () {
      el.style.left = (beforeRect.left - wrapRect.left) + 'px';
      el.style.top = (beforeRect.top - wrapRect.top) + 'px';
      el.style.width = beforeRect.width + 'px';
      el.style.height = beforeRect.height + 'px';
    }, onSettled);
  }

  function showGallery(clickedKey) {
    if (galleryOpen) return;
    galleryOpen = true;
    activeGalleryKey = clickedKey;
    clearTimeout(galleryTimer); // cancel any pending cleanup left over from a just-finished hideGallery()

    var clickedEntry = entryFor(clickedKey);

    // clear any stray hover-lift transform first — if the cursor was
    // still over the plant when clicked (the normal case, since you're
    // clicking directly on it), .lifted's own transform would otherwise
    // be baked into beforeRect below
    entries.forEach(function (e) { if (e.liftEl) e.liftEl.classList.remove('lifted'); });
    var beforeRect = clickedEntry && clickedEntry.liftEl ? clickedEntry.liftEl.getBoundingClientRect() : null;

    // instantly hide the background illustration before .gallery-mode
    // resizes .hero-image-wrap to full-screen, not after. .hero-
    // illustration is a plain block child sized by width:100% (up to a
    // max-width cap) — it has no left/top of its own, so when the wrap
    // suddenly goes full-screen, normal block layout snaps it to the
    // wrap's top-left corner. There's no way to animate a layout jump
    // like that (it isn't a transitionable property), so the only fix is
    // making sure it's already invisible before that jump happens,
    // instead of fading out (via the .detail-open opacity rule, further
    // below) while still visible in the wrong spot for a moment.
    if (img) {
      withTransitionDisabled(img, function () { img.style.opacity = '0'; }, function () {
        // hand control back to the CSS rule (.detail-open .hero-
        // illustration{opacity:0}, both classes already applied by now)
        // once the jump has safely happened — it already agrees with
        // this inline value, so nothing visibly changes, but leaving the
        // inline opacity in place would permanently block the CSS rule
        // for .detail-open being removed later (Back) from ever
        // revealing it again, since inline styles win over class rules
        img.style.opacity = '';
      });
    }

    document.body.classList.add('gallery-open'); // hides .home-work/.scroll-indicator — see CSS
    wrap.classList.add('detail-open', 'gallery-mode');
    entries.forEach(function (e) {
      e.hotspotEl.hidden = true;
      if (e.liftEl) e.liftEl.classList.toggle('active-detail', e === clickedEntry);
    });

    // measured once — see the note on galleryAnchorPx() above
    var wrapW = wrap.offsetWidth, wrapH = wrap.offsetHeight;

    GALLERY_ORDER.forEach(function (key, i) {
      var entry = entryFor(key);
      var anchor = galleryAnchorPx(i, wrapW, wrapH);
      positionGalleryLabels(key, anchor);
      if (!entry || !entry.liftEl || key === clickedKey) return; // clicked one animates in below, not set instantly
      // transition disabled — see withTransitionDisabled()'s own comment;
      // still invisible at this point (not yet .active-detail) either way
      withTransitionDisabled(entry.liftEl, function () { applyGalleryPosition(entry.liftEl, anchor); });
    });

    galleryBack.hidden = false;
    galleryLabels[clickedKey].nameEl.classList.add('show');
    galleryLabels[clickedKey].wateredEl.classList.add('show');

    if (beforeRect && clickedEntry.liftEl) {
      var clickedAnchor = galleryAnchorPx(GALLERY_ORDER.indexOf(clickedKey), wrapW, wrapH);
      flyingEntry = clickedEntry; // see positionAllForCurrentState()
      translateIntoNewFrame(clickedEntry.liftEl, beforeRect, function () {
        applyGalleryPosition(clickedEntry.liftEl, clickedAnchor);
        flyingEntry = null;
      });
    }

    // the rest of the row only fades in once the lead plant has actually
    // arrived — not while it's still mid-flight, so it reads as "one
    // plant moves, the rest just appear" rather than everyone arriving
    // together
    galleryTimer = setTimeout(function () {
      GALLERY_ORDER.forEach(function (key) {
        if (key === clickedKey) return;
        var entry = entryFor(key);
        if (entry && entry.liftEl) entry.liftEl.classList.add('active-detail');
        galleryLabels[key].nameEl.classList.add('show');
        galleryLabels[key].wateredEl.classList.add('show');
      });
    }, SLIDE_MS);
  }

  function hideGallery() {
    if (!galleryOpen) return;
    galleryOpen = false;
    clearTimeout(galleryTimer); // cancel showGallery()'s pending "fade in the rest" timer if Back was clicked quickly

    var returningKey = activeGalleryKey;
    var returningEntry = entryFor(returningKey);
    activeGalleryKey = null;
    var beforeRect = returningEntry && returningEntry.liftEl ? returningEntry.liftEl.getBoundingClientRect() : null;

    // everyone but the returning plant goes invisible immediately —
    // nothing to see, so no harm cutting it instantly
    entries.forEach(function (e) { if (e.liftEl) e.liftEl.classList.toggle('active-detail', e === returningEntry); });
    GALLERY_ORDER.forEach(function (key) {
      galleryLabels[key].nameEl.classList.remove('show');
      galleryLabels[key].wateredEl.classList.remove('show');
    });
    galleryBack.hidden = true;

    wrap.classList.remove('gallery-mode'); // instantly back to the normal in-page box

    // everyone but the returning plant reappears at their sill spot —
    // invisible at this point either way, but transition still disabled
    // (see withTransitionDisabled()) so there's nothing left over to
    // animate if they get re-painted before their opacity actually
    // catches up
    entries.forEach(function (e) {
      if (e === returningEntry || !e.liftEl) return;
      withTransitionDisabled(e.liftEl, function () { positionEntry(e); });
    });

    if (beforeRect && returningEntry && returningEntry.liftEl) {
      flyingEntry = returningEntry; // see positionAllForCurrentState()
      translateIntoNewFrame(returningEntry.liftEl, beforeRect, function () {
        positionEntry(returningEntry); // slides smoothly back to its liftAnchor
        flyingEntry = null;
      });
    }

    // background/other plants/caption/bio text start fading back in
    // right away — concurrent with the returning plant's own flight,
    // not queued up behind it
    document.body.classList.remove('gallery-open');
    wrap.classList.remove('detail-open');

    // hotspots only become clickable again once this transition has
    // actually finished — showing them immediately let a quick second
    // click start a new showGallery() while this cleanup was still
    // pending, corrupting both transitions' state at once
    galleryTimer = setTimeout(function () {
      entries.forEach(function (e) {
        e.hotspotEl.hidden = false;
        if (e.liftEl) e.liftEl.classList.remove('active-detail');
      });
    }, 650); // just past the flight's own transition duration
  }

  galleryBack.addEventListener('click', hideGallery);

  // non-interactive decorative addition — sits on the sill but isn't
  // part of the click-a-plant system (no hotspot, no care info, no
  // per-weather variants, just one static image). Still shares
  // .plant-lift-layer's day/night filter and detail-open fade-out
  // automatically via the class, so it dims/hides the same way the
  // plants do without any extra wiring here.
  var DECOR = [
    {liftId: 'plantLiftSmiski', anchor: {centerX: 0.1225, bottom: SILL_LINE, height: 0.11}},
  ];

  function positionDecorEl(el, a) {
    var liftHeight = img.offsetHeight * a.height;
    var natural = el.naturalWidth && el.naturalHeight ? el.naturalWidth / el.naturalHeight : 1;
    var liftWidth = liftHeight * natural;
    var centerX = img.offsetLeft + img.offsetWidth * a.centerX;
    var bottomY = img.offsetTop + img.offsetHeight * a.bottom;
    // decor never intentionally animates (no hotspot, no flight, always
    // the same sill anchor) — but .hero-image-wrap.gallery-mode
    // .plant-decor{display:none} only hides it visually; it's still
    // repositioned in the background whenever the gallery is open (e.g.
    // by the ResizeObserver, if the illustration's box happens to
    // resize). Left alone, that reposition would use its normal .5s
    // left/top/width/height transition (see .plant-lift-layer in
    // site.css) — invisible while display:none, but then it'd visibly
    // catch up/slide the instant the gallery closes and display:none
    // lifts. withTransitionDisabled keeps every reposition instant, so
    // it only ever fades with the rest, never slides.
    withTransitionDisabled(el, function () {
      el.style.width = liftWidth + 'px';
      el.style.height = liftHeight + 'px';
      el.style.left = (centerX - liftWidth / 2) + 'px';
      el.style.top = (bottomY - liftHeight) + 'px';
    });
  }

  function positionDecor() {
    DECOR.forEach(function (d) {
      var el = document.getElementById(d.liftId);
      if (el) positionDecorEl(el, d.anchor);
    });
  }

  DECOR.forEach(function (d) {
    var el = document.getElementById(d.liftId);
    // width/height depend on this image's own natural dimensions, which
    // may not be decoded yet — same pattern as the PLANTS loop above
    if (el && !el.complete) el.addEventListener('load', function () { positionDecorEl(el, d.anchor); });
  });

  infoBack.addEventListener('click', showWindow);

  window.addEventListener('weatherchange', syncLiftLayers);

  // reposition whenever the background image's rendered box changes —
  // window resize, or its src swapping to a differently-proportioned
  // illustration (weather.js's variants aren't all cropped to the exact
  // same aspect ratio, though .hero-illustration's fixed aspect-ratio
  // now keeps the box itself constant regardless)
  if (window.ResizeObserver) {
    new ResizeObserver(positionAllForCurrentState).observe(img);
  } else {
    window.addEventListener('resize', positionAllForCurrentState);
  }
  window.addEventListener('load', positionAllForCurrentState);
  positionAll();
})();
