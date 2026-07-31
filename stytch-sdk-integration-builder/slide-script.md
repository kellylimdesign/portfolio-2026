# Stytch SDK Integration Builder — Slide Script

Working narrative for the reworked case study. Mirrors the structure used for the
Twilio Agent Identity ("Building Trust") case study: problem statement → evidence →
opportunity → goals → iteration-with-rationale (each tied to a real mock) → final design.

Revised 2026-07-02: condensed from 17 slides to 12. The original had 7 slides with no
supporting mock (pure assertion) — those are now merged/cut so every remaining slide
is either a real mock or a tight quote-based evidence slide. No before/after "old UI"
comparison — the pre-fix friction was anecdotal (SE/customer-success conversations),
not documented in any surviving screenshot, so it's represented as quotes, not
invented visuals.

Two throughlines to keep surfacing in the voiceover:
1. **Feature parity ≠ confidence.** Chasing API parity didn't move adoption — the gap
   was never capability, it was proof.
2. **Show, don't tell.** Every decision from the styling audit onward is about closing
   the gap between claiming "fast integration" and letting a customer actually
   experience it, for their own product, before they write a line of code.

---

## Slide 1 — Title
**Driving SDK Adoption**
*Increasing conversion and adoption of Stytch's SDK prebuilt UI*

Mock: authkit.dev / SDK Integration Builder hero shot.

Voiceover: The SDK was Stytch's fastest path to auth — prebuilt UI, no need to build
your own components. Adoption wasn't matching that promise, and the first read was
that it was a capability gap.

---

## Slide 2 — Problem statement
**New customers evaluating Stytch often faced uncertainty about whether our SDK met
their authentication needs — with no way to find out without a full integration.**

Voiceover: The team closed the API feature-parity gap first, assuming that was what
held adoption back. Customers said the same thing anyway. The real blocker wasn't
capability — it was proof. That friction showed up directly in SE and
customer-success conversations, slowing or killing deals before a customer wrote any
code.

*(No separate mock for this slide — keep it to the one bolded line, no extra
paragraph underneath.)*

---

## Slide 3 — Opportunity area
**Our SDK's biggest value proposition — fast time to integration — wasn't being
demonstrated. Evaluating Stytch first wasn't fast at all.**

Mocks: Hello Socks, Survey Amp example apps.

Voiceover: The only way to answer "can this work for me" was a Solutions Engineer
building a one-off demo — expensive to scale, and a quiet contradiction of the pitch.
Example apps like these helped as reference, but they showed instances of the SDK,
not a customer's own product — which is the question customers actually kept asking.

---

## Slide 4 — What customers were asking
Quote cards (tighten to fragments, not full sentences where possible):
- *"Will the prebuilt UI look like it's part of my product?"*
- *"What products are available?"*
- *"Can you mock up what this would look like for us — before we decide?"*
- *"How do I get this into my product, quickly?"*

Voiceover: Four recurring, specific asks — not vague dissatisfaction. Visibility into
the full catalog, visibility into brand fit, a preview before committing, and a fast
path from preview to production.

---

## Slide 5 — Where "can I customize this" kept breaking down
Mock: styling audit diagram (design-system-to-SDK property mapping), annotated at the
drift point with a real customer/SE quote about a specific styling mismatch that
caused confusion — **[insert actual quote here once found]**.

Voiceover: One thread ran through these conversations: even simple styling questions
had no clean answer. Auditing the config showed why — in scaling quickly, the mapping
between the design system and the SDK's actual settings had drifted, so even the
Stytch team couldn't always say what mapped to what. This isn't a code-refactor
story — it's a naming/discoverability problem that happened to require a code fix.

*(Action item: swap in a real quote from an SE/CS conversation if one can be
recovered — makes this slide's evidence as concrete as slide 4's.)*

---

## Slide 6 — Goals
- Fast, easy way to preview Stytch
- Reduce time to value
- Improve decision-making before writing code

Voiceover: Cleaning up the config fixed usability — it didn't fix previewing, which
was the bigger and separate problem. Stepping back from config-cleanup mode, these
became the three explicit goals for the onboarding/evaluation experience.

---

## Slide 7 — Previewing the SDK (exploration)
Mock: low-fi layout, preview panel + customization panel, full product/OAuth/Web3 list.

Voiceover: The idea that took shape was an interactive playground — inspired by
competitor SDKs that let you toggle dark/light mode or preset themes, extended
further to let customers supply their own inputs and see the SDK respond live.

---

## Slide 8 — Previewing the SDK (refined)
Mock: same layout, refined — "Stytch pre-built SDK embedded" label, tightened panel.

Voiceover: Refining the layout kept the same core structure while narrowing what
still needed to be solved: product selection and styling.

*(Open question below — 7 and 8 are close enough that they may not both need to be
full slides.)*

---

## Slide 9 — Configuring the SDK preview: Products
**Make products intuitive to adjust without overwhelming users.**

Mocks: select-dropdown vs. multi-select list vs. button-grid layouts.

Voiceover: Select menu vs. button grid. A dropdown saves space, but hides the
catalog — customers have to already know what to look for. Since customers at this
stage often don't know Stytch's full offering yet, "show everything upfront" won:
button grid, nothing hidden.

---

## Slide 10 — Configuring the SDK preview: Styling
**Make styling intuitive to adjust without overwhelming users.**

Mocks: per-element tabbed sections vs. all styling properties in one flat panel.

Voiceover: Sectioned/tabbed styling relies on customers already knowing where a
change will show up. One flat panel, next to the live preview, made it easier to
bounce between properties and see the effect immediately — same principle as
Products: don't hide things behind navigation when the goal is fast, transparent
evaluation.

---

## Slide 11 — Final design
**A side-by-side layout that lets customers preview their SDK in real time.**

Mock: SDK Integration Builder — products and styling fully visible, live preview,
"View Code" button.

Voiceover: Products as buttons, styling all visible, nothing behind tabs. The last
piece — **View Code** — generates production-ready code straight from whatever
configuration a customer just built. Direct answer to "reduce time to value": the
moment evaluation ends, the integration is already in hand.

---

## Slide 12 — Previewing UX flows
Mock: SDK Integration Builder with functional preview mid-flow (GIF).

Voiceover: The preview isn't a static visual — it's a fully functional SDK instance,
so customers can click through the actual sign-up/login flow, not just a styled
screenshot. Styling answers "does this fit my brand" — customers cared just as much
about how the flow behaved. This is where "show, don't tell" closes: customers
experience the exact UX Stytch designed, before deciding anything.

---

## Slide 13 — Impact
**Designed to close the loop between "does this work for me" and "let's integrate it."**

- **Fast, easy preview** → replaced the SE-built custom demo (slide 3) as the default
  way a customer evaluates Stytch — validated by SEs themselves adopting it for
  customer and prospect calls
- **Reduced time to value** → View Code turns the end of evaluation directly into a
  working integration, no separate build step
- **Better decision-making** → customers validate product fit, brand fit, and real
  UX flows themselves, before writing code or looping in a rep

Voiceover: No adoption or conversion numbers to cite yet, but one real signal came
from the team whose workaround this project set out to replace: Solutions Engineers
said the Integration Builder was genuinely helpful for demoing, and started using it
directly on customer and prospect calls — the same job the one-off custom demos from
slide 3 used to do. That's the clearest validation available that the tool solved the
problem it was built for, even without hard usage data.

---

## Open items
- **Slide 5 needs a real quote.** Right now it's a placeholder — find an actual line
  from an SE/CS conversation about a specific styling mismatch, or the slide reverts
  to asserting the audit's importance rather than proving it.
- **Slides 7–8** are still similar enough that they might merge into one "how the
  layout idea evolved" slide, or slide 8 gets cut if it doesn't add a visibly
  different decision.
- Confirmed 2026-07-02: no before/after "old UI" comparison — no artifact exists,
  don't fabricate one. Anecdotal friction is represented via quotes only (slides 2, 4).
- Confirmed 2026-07-02: no origin-story beat. Closing slide (13) IS included, framed
  as intended outcomes + the SE-adoption signal above — not a fabricated
  metrics-style results slide (see [[project-stytch-sdk-case-study]] memory).
