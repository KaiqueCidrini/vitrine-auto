---
target: home page
total_score: 27
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\kaiqu\\OneDrive\\Área de Trabalho\\Projetos\\vitrine-auto\\src\\app\\(public)\\page.tsx"
target_fingerprint: "sha256:c148654062e6089bf12256a8fbef7ca28ffe333b28ef8eacda70e94720d26933"
target_path: "C:\\Users\\kaiqu\\OneDrive\\Área de Trabalho\\Projetos\\vitrine-auto\\src\\app\\(public)\\page.tsx"
timestamp: 2026-09-30T03-36-19Z
slug: src-app-public-page-tsx
---
Method: dual-agent (A: a3a10ac86124abe26 · B: a72bbe78aff1e70a8)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Hero's only "scroll for more" cue is tiny, low-contrast, and hidden below `lg` — mobile visitors get zero scroll affordance |
| 2 | Match System / Real World | 3/4 | Strong Brazilian used-car vocabulary, undercut by mixing one real photo with cartoon placeholder cars in the same carousel |
| 3 | User Control and Freedom | 4/4 | Carousel supports swipe + arrows + keyboard; mobile menu closes on Escape correctly |
| 4 | Consistency and Standards | 4/4 | Tokens, spacing, and component patterns consistent throughout per DESIGN.md |
| 5 | Error Prevention | 3/4 | Little error surface on this page; nothing exercised negatively |
| 6 | Recognition Rather Than Recall | 4/4 | Nav, specs, and category counts always visible, no memorization required |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing page — no repeat-user power path expected |
| 8 | Aesthetic and Minimalist Design | 3/4 | Hero is minimalist to a fault — ~90% of first viewport carries almost no information |
| 9 | Error Recovery | 3/4 | No error states surfaced on this page; nothing to evaluate deeply |
| 10 | Help and Documentation | n/a | Persuade-mode consumer page — WhatsApp CTA is the "ask a human" escape hatch |
| **Total** | | **27/32** | **Good (84%)** |

## Design Specificity Verdict

**Split verdict, and the split matters: the single most-seen surface fails it.** The hero — 88–94% of the viewport on every device — has no car in it at all. The `demo` tenant sets no `backgroundImage`, so `HeroSection` falls into the "ambient" fallback: a plain primary-blue gradient, two blurred blobs, and a faint dot-grid mask. That reads as a generic B2B/SaaS hero, not a car showroom.

Below the hero, genuine dealership-specific touches exist: WhatsApp woven through header, floating button, hero secondary CTA and closing CTA with a reserved, never-reused green; vehicle cards carry brand/model/version/year/km/transmission; the closing CTA pairs "Venha fazer um test drive" with a real street address, hours, and a maps link. These aren't swappable-with-any-SaaS choices.

But the section-order template (hero → featured carousel → category tiles → 4-icon benefits grid → dark CTA banner → footer) is a common generic marketing skeleton, and nothing in the type/motion/shape system is inherently automotive — it's a tasteful *generic premium* system with car content dropped in. No dealership-specific structural device exists anywhere (no spec-sheet visual language beyond a dotted inline list, no freshness signal, no financing calculator despite "Financiamento facilitado" being a stated benefit, no real photography of the lot/staff, no reviews).

**Deterministic scan (Assessment B):** 38 findings per viewport (28 warning + 10 advisory), identical across desktop and mobile. Grouped: `hero-eyebrow-chip` (1), `cramped-padding` (3), `clipped-overflow-container` (1), `gray-on-color` (7, all `#d8dee8` on `#0a1a33`), `overused-font` (1, Inter 73% of text), `kicker-above-heading` (4), `radial-halo` (1), `image-hover-transform` (10, advisory), `low-contrast` (10).

**Reconciling detector output against the polish pass already applied this session:** every `low-contrast` finding's *median* now clears 4.5:1 (5.0–7.1:1 range) except the phone number, which sits right at the line (4.5–4.6:1) — the tool's failure signal is driven by raw minimum anti-aliased-edge pixel sampling (1.3–1.9:1), which will fire on essentially any rendered text regardless of real legibility. Treat these as resolved/noise, with the phone number worth one more nudge. The `gray-on-color` rule (7×) pattern-matches on the raw token values (`#d8dee8`/`#0a1a33`) without factoring in the opacity fix already applied — also noise now that measured contrast is healthy.

**Likely false positives (independently corroborated by both assessments):** `clipped-overflow-container` — the "positioned child" is the vehicle card's small corner status badge, fully inset within its own card bounds; it never needs to escape the section, unlike a tooltip/menu. `cramped-padding`'s two "0px vertical padding" entries and the "border-b flush" entry most likely trace to the site header's flex-centered nav row (`items-center` supplies visual spacing the checker can't see as equivalent to padding) — neither agent could fully pin this down, low confidence either way, no action recommended without a concrete visual repro.

**Confirmed-but-intentional (not defects, but worth your explicit call):** `hero-eyebrow-chip` + `kicker-above-heading` (×4) — the small tracked-caps labels above headings are already a documented, deliberate system characteristic (DESIGN.md), used in every section; `radial-halo` — the hero's ambient blob backdrop is explicitly named in DESIGN.md ("ambient drifting light") and only appears *because* the demo tenant has no hero photo (see P0 below — the real fix is giving demo a photo, which removes this flag as a side effect, not suppressing the rule); `overused-font` (Inter) — `demo`'s own font choice among the 3 tenant-supported options, not a code defect; `image-hover-transform` (×10, advisory) — the slow 1000ms card-image zoom is a documented, deliberate signature move.

## Overall Impression

The system (tokens, motion, component craft) is genuinely well-built and mostly product-appropriate — but the actual reference tenant's homepage, the thing every prospective client and reviewer judges first, is currently showing its most generic code path (no-photo hero fallback) at the exact moment it needs to land hardest, and has zero trust/social-proof content anywhere on a page selling a high-stakes, trust-sensitive purchase. The biggest opportunity is narrow and concrete: give the `demo` tenant a real hero photo. That alone fixes the P0, removes the `radial-halo` flag, and stops undercutting the "Confident Showroom" identity the rest of the system already earns.

## What's Working

1. **WhatsApp-first is a system, not a button.** Consistent color/role across header, floating button, hero, and closing CTA — never confused with the brand accent — exactly matching the stated product differentiator.
2. **VehicleCard micro-interactions feel deliberately "expensive."** The 1000ms image zoom, the arrow that inverts to primary color and rotates 45° on hover, and the whole-card link target are restrained and clearly engineered — one of the few places the "premium automotive" aspiration is actually delivered today, not just documented.
3. **ContactCtaSection is authored for a specific local business.** Real street address, hours, and a maps link sit next to the WhatsApp CTA instead of a generic "Contact us" banner.

## Priority Issues

**[P0] Hero shows zero automotive imagery; falls back to a generic gradient-and-grid pattern**
- **Why it matters**: This is the largest, first, most-seen surface on the page — the one every prospective client/reviewer judges the product by — and it currently runs the least differentiated code path in the whole system.
- **Fix**: Give the `demo` tenant an actual hero photo so the flagship reference tenant exercises the system's real signature move (cinematic Ken Burns photo), not the no-photo ambient fallback.
- **Suggested command**: `/impeccable adapt`

**[P1] Two reserved "loudest" colors collide in the hero's one CTA moment**
- **Why it matters**: DESIGN.md reserves amber to be rare and WhatsApp green to read as its own distinct utility color; the hero currently stacks the amber "Ver estoque" button and the green "Falar com um vendedor" pill at equal size and weight, creating two competing "shouts" in the single most important decision moment on the page.
- **Fix**: Keep one full-weight pill (search + amber) and demote the hero's WhatsApp action to a lighter treatment (text link with icon, or the `overlay` button variant), reserving the full WhatsApp pill for the header/floating button where it already lives.
- **Suggested command**: `/impeccable clarify`

**[P1] No trust/social-proof content anywhere on the homepage**
- **Why it matters**: PRODUCT.md frames this as a high-stakes, trust-sensitive purchase; only first-party benefit copy exists ("Garantia", "Laudo cautelar") — nothing lets a skeptical buyer verify legitimacy before being asked to message a stranger on WhatsApp.
- **Fix**: Add a lightweight social-proof element (rating badge, short testimonial, real lot/team photo) between Benefits and the closing CTA, where reassurance should peak just before the ask.
- **Suggested command**: `/impeccable harden`

**[P2] Inconsistent photography quality undermines showroom credibility**
- **Why it matters**: The featured carousel mixes one grainy real photo with flat "Imagem ilustrativa" placeholder cars in the same row — in a "curated/destaque" carousel this reads as thin/unfinished inventory, not a confident showroom.
- **Fix**: Seed the demo tenant's showcase vehicles with consistent, real (or consistently-styled) photography.
- **Suggested command**: `/impeccable polish`

**[P2] Oversized hero delays time-to-content, especially on the stated target devices**
- **Why it matters**: PRODUCT.md names slow connections/older phones as a real constraint, and the core conversion path is "get to WhatsApp fast" — a near-full-viewport decorative hero on every device works directly against that on the exact devices called out as the priority.
- **Fix**: Reduce the hero's minimum height on small viewports so mobile visitors reach real content sooner.
- **Suggested command**: `/impeccable optimize`

## Persona Red Flags

**Casey (Distracted Mobile User)**: On a 390×844 capture, the first screen is dominated by empty gradient with no car in sight. Compounding this, the pulsing floating WhatsApp button (bottom-right) sits close to the equally-green "Falar com um vendedor" pill (bottom-left) — two near-identical green affordances in the same glance.

**Jordan (Confused First-Timer)**: The hero's only input is a bare text search with no hint of what to type and no visible filter at that point — Jordan must scroll past the entire hero and featured-vehicles carousel before reaching "Explore por categoria," the only non-text way to narrow toward "I want an SUV under R$60k," a very common way a first-timer actually thinks.

**Sam (Accessibility-Dependent User)**: Both the body-type tile's arrow reveal and the vehicle card's rotating arrow use `group-hover` only, with no `group-focus-within` equivalent — a keyboard user tabbing through gets the focus ring but none of the crafted motion the mouse-driven experience is built around.

## Minor Observations

- The hero's `ScrollCue` ("Role" + thin line) is the only "there's more" affordance and is hidden below `lg` — mobile visitors, who have the least evidence anything follows the hero, get none of it.
- `BodyTypeShortcutsSection` hard-bails (`showcase.length < 2 → null`) with no fallback messaging — a tenant with thin inventory silently loses the whole section.
- The floating WhatsApp button runs an indefinite `animate-ping` for the whole session (respects `prefers-reduced-motion` correctly) — worth watching for fatigue on long sessions.
- Vehicle card `alt` text is properly descriptive; body-type tile images correctly use `alt=""` since the label is duplicated as visible text — accessibility basics handled correctly.
- The phone number in the footer sits right at the WCAG line (median 4.5–4.6:1) — worth one more opacity nudge for safety margin.

## Questions to Consider

1. If the `demo` tenant — the one every prospective client and internal reviewer actually sees — doesn't exercise the hero's cinematic-photo mode, is "Confident Showroom" something this codebase currently *does*, or only something it's designed to be able to do?
2. In the first five seconds, is a car buyer trying to decide "is this dealership legitimate" or "do they have my car"? The current hero answers neither.
3. Since structure/copy/behavior are meant to stay frozen in a refinement pass, where does trust-building content (reviews, real lot photos, staff) fit — is it out of scope by design?
4. If this is what gets demoed to a prospective dealership client, does showing two illustrated placeholder cars next to one grainy real photo undersell the product itself?
