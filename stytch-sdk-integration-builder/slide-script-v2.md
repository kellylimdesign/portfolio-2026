# Stytch SDK Integration Builder — Slide Script v2

Restructured to match the *current* Trust ("Building Trust in the Age of AI") deck —
not the original 13-slide version of this script, which was written against an
older, denser version of that deck. Trust has since condensed into 9 slides: a tight
problem → persona → grounding → example → one big step-nav journey → impact arc,
with a live clickable prototype at the end. This mirrors that shape.

Two throughlines to keep surfacing (unchanged from v1):
1. **Feature parity ≠ confidence.** Chasing API parity didn't move adoption — the gap
   was never capability, it was proof.
2. **Show, don't tell.** Every decision in the Journey slide closes the gap between
   claiming "fast integration" and letting a customer experience it, for their own
   product, before writing code.

Status: draft, no mocks yet. Every slide below is written to be *replaced or
tightened* once real mocks land in `mocks/` — nothing here should be treated as
final copy. Flagged inline wherever a claim needs a real mock or quote to back it up.

---

## Slide 1 — Hero

**Kicker:** Stytch · SDK Integration Builder
**H1:** Driving SDK Adoption
**Teaser:** Prebuilt UI was supposed to be the fastest path to auth — no components
to build. Adoption said otherwise.

Mock needed: SDK Integration Builder hero shot (final state, for the masked
laptop-frame treatment Trust uses on its own hero).

---

## Slide 2 — Problem

**Kicker:** The Problem
**H1:** Feature Parity Wasn't the Gap
**Teaser:** The SDK's whole pitch was fast auth — nothing to build. But evaluating
Stytch wasn't fast at all: customers had no way to know if the SDK actually fit
their product without integrating it first.

**For Example:** The team's first read was a capability gap, so they closed every
remaining API difference. Customers said the SDK still didn't meet their needs
anyway.

No mock needed — matches Trust's slide 2, which also runs text-only.

---

## Slide 3 — Persona

**Kicker:** Who This Is For
**H1:** Two Audiences, One Tool
**Body:** two cards, mirroring Trust's persona-card layout.

- **The Evaluator** — a developer or team deciding whether Stytch fits their
  product, before writing any integration code.
  *For Example:* a customer sizing up Stytch for their own app's auth
- **The Solutions Engineer** — Stytch's own team, who used to build one-off demos
  by hand to answer exactly the question the Evaluator is asking.
  *For Example:* an SE on a prospect call

Note: the SE card is the strongest, most literal parallel to Trust's two-persona
structure — and unlike Owl Trade's two personas, this one isn't hypothetical. SEs
actually adopted the finished tool for their own calls (see Slide 7). Worth deciding
whether to foreshadow that here or let it land as a surprise at the impact slide —
leaning toward *not* foreshadowing, so slide 7 lands harder.

---

## Slide 4 — Grounded in Real Usage

**Kicker:** Before We Designed
**H1:** We Audited What Customers Actually Asked For
**Teaser:** Even simple styling questions had no clean answer — the mapping between
Stytch's design system and the SDK's actual config had drifted as things scaled, so
even the team couldn't always say what mapped to what. Redesigning what the builder
exposed started with fixing that, not guessing at what customers might want.

Mock needed: one supporting visual (styling audit / config-mapping diagram) — shown
once, not itemized. This slide's job is to establish rigor, not narrate the fix.

**Open item:** a real customer/SE quote about a specific styling mismatch would
make this land the way Slide 2's "For Example" does — swap in if one exists,
otherwise keep it to the one teaser line above and no invented quote.

---

## Slide 5 — Transition / Example

**Kicker:** Hello Socks × Survey Amp · Reference Apps
**H1:** Can a Customer See Their Own Product Here?
**Teaser (in an example-callout, matching Trust's slide-5 visual language):** Example
apps like these help — but they show what the SDK looks like, not what it would look
like *for a customer's own product*, which is the question customers actually kept
asking. Here's what building an answer to that looked like.

Mocks needed: Hello Socks, Survey Amp screenshots.

**Open item:** confirm whether to keep these as the through-line "product" referenced
in the Journey slide's step callouts, the way Owl Trade carries through Trust's
steps — leaning yes, since they're real (unlike an invented company) and already
established here.

---

## Slide 6 — The Evaluation Journey

**Kicker:** The Customer Journey
The big slide — one step-nav accordion, matching Trust's Customer Journey slide
exactly: numbered steps on the left, each with a title + one-line rationale baked
in (not a separate evidence slide), real screen on the right.

**Step 1 — Explore the catalog**
*Nothing hidden behind a search bar.* Customers evaluating Stytch often don't know
the full product catalog yet — a dropdown would make them search for something they
don't know exists. A button grid shows everything upfront instead.

**Step 2 — Make it match your brand**
*One flat panel, not sections you have to already know to look in.* Styling
questions kept breaking down because customers couldn't predict where a property
would show up. Every property sits next to the live preview, so the effect is
immediate, not filed under a tab.

**Step 3 — Try the real flow, not a screenshot**
*A working SDK instance, not a static mock.* Styling answers "does this match my
brand" — customers cared just as much about how the flow actually behaved.
Clicking through the real sign-up/login flow answers both at once.

**Step 4 — Ship the code**
*View Code turns the config into a real integration.* The moment evaluation ends,
the answer to "how do I get this into my product, quickly" is already in hand — not
a separate build step.

Mocks needed per step: products button-grid, styling flat-panel, functional preview
(ideally a short clip/GIF given it's a real interaction, matching Trust's Owl Trade
demo GIF), View Code output.

**Open item:** old script's slides 7–8 (two similar low-fi exploration mocks) are
deliberately cut here — the *decision* (button grid vs. dropdown, flat panel vs.
tabs) lives in the step rationale above instead of getting its own slide, matching
how Trust folded its old per-decision slides into step callouts.

---

## Slide 7 — Impact

**Kicker:** Impact
**H1:** Built to Close One Gap
**Teaser:** No adoption or conversion numbers to cite yet. But the team whose
workaround this was built to replace — Solutions Engineers — started using the
Integration Builder on their own customer and prospect calls. The same job the
one-off demos from Slide 5 used to do, replaced by the tool built to answer the
question directly.

List (matching Trust's validation-list treatment, but as *delivered outcomes* since
this shipped, not a forward-looking validation list like Trust's):
- **Fast, easy preview** → replaced the SE-built custom demo as the default way a
  customer evaluates Stytch
- **Reduced time to value** → View Code turns the end of evaluation directly into a
  working integration
- **Better decision-making** → customers validate product fit, brand fit, and real
  UX flows themselves, before writing code or looping in a rep

No mock needed.

---

## Slide 8 — Live Prototype

Placeholder only — matches Trust's closing "Try it yourself" slide. Scope TBD until
Slide 6's mocks are in and we know which pieces (Products grid, Styling panel, View
Code) are worth rebuilding live vs. keeping as real screenshots/clips.

---

## Open items (carried over + new)

- **Slide 4 quote** — same ask as v1: a real SE/CS quote about a specific styling
  mismatch would strengthen this slide the way Slide 2's callout does. Without one,
  the slide stays at its current one-line teaser, no invented quote.
- **Slide 3 foreshadowing** — decide whether the SE-persona card should hint at the
  impact-slide payoff or stay understated.
- **Slide 5 through-line** — confirm Hello Socks/Survey Amp as the recurring
  reference through Slide 6's step callouts (like Owl Trade in Trust), or keep
  Slide 6 generic/customer-agnostic.
- **No fabricated before/after** — carried over from v1: no invented "old UI"
  comparison. Anecdotal friction stays in quote form only, and only where a real
  quote exists.
- **Live prototype scope** — Slide 8 is a placeholder until Slide 6 mocks exist.
