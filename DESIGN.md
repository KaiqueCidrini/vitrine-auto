---
name: Vitrine Auto
description: Reskinnable dealership showroom system — one confident, cinematic stage; colors and type change per tenant
colors:
  primary: "#0B3D91"
  primary-foreground: "#FFFFFF"
  accent: "#F59E0B"
  accent-foreground: "#1F1300"
  background: "#F6F7F9"
  surface: "#FFFFFF"
  foreground: "#0F172A"
  muted-foreground: "#5B6474"
  border: "#E2E6EC"
  header-background: "#FFFFFF"
  footer-background: "#0A1A33"
  footer-foreground: "#D8DEE8"
  danger: "#DC2626"
  success: "#16A34A"
  whatsapp: "#25D366"
  whatsapp-foreground: "#062B14"
typography:
  display:
    fontFamily: "Playfair Display, ui-serif, Georgia, serif"
    fontSize: "clamp(3rem, 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Playfair Display, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.2em"
rounded:
  sm: "0.375rem"
  md: "0.75rem"
  lg: "1.125rem"
  xl: "1.5rem"
  button: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.whatsapp-foreground}"
    rounded: "{rounded.button}"
    padding: "0 1.5rem"
    height: "2.75rem"
  badge-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.button}"
    padding: "0.25rem 0.6rem"
  badge-neutral:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "0.25rem 0.6rem"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "1.75rem"
---

# Design System: Vitrine Auto

## Overview

**Creative North Star: "The Confident Showroom"**

Vitrine Auto is not one dealership's look — it's a stage built to make any dealership feel like a real showroom the moment a client's colors and type are dropped in. Every reskin (from `demo`'s blue-and-amber daylight dealership to `premium-example`'s black-and-gold boutique) inherits the same underlying grammar: a cinematic full-bleed hero with a slow Ken Burns pull-back or ambient drifting light, staggered fade-up entrances, generous whitespace, and interactive surfaces that respond with confidence — brightening, lifting, rotating — the instant a visitor's cursor arrives. Nothing sits static out of laziness; stillness is the resting state, and motion is always a direct reply to attention or interaction.

The aspiration is a premium-automotive-brand level of restraint and polish — full-bleed photography, unhurried pacing, generous negative space — while keeping today's structure, copy, and behavior untouched. That bar is not yet fully reached everywhere in the codebase; closing the gap is refinement work, not a rebuild.

Two structural facts govern every visual decision here:

1. **Tokens, never literals.** Every color, radius, and button shape a component uses must resolve through the CSS custom properties in `globals.css` (`--color-primary`, `--radius-md`, `--radius-button`, …), which `buildThemeStyle` re-writes per tenant. A component that reads correctly for `demo` and wrong for `premium-example` has a bug, not a style choice.
2. **Motion is opt-in, never load-bearing.** Every animation degrades to instantly-visible content without JavaScript, and every transition respects `prefers-reduced-motion`. The showroom must work with the lights off.

**Key Characteristics:**
- Full-bleed cinematic hero (photo Ken Burns pull-back, or ambient drifting color blobs + faint grid when no photo exists)
- Staggered fade-up entrance choreography on hero copy and on every section as it enters the viewport
- Flat-at-rest surfaces; shadow and lift appear only as a direct response to hover/focus
- Pill-shaped buttons by default (fully reskinnable to the theme's base radius instead)
- Editorial serif display type as an optional register on top of a confident sans-serif base
- A single reserved utility color (WhatsApp green) that is never treated as a brand color

## Colors

The palette is entirely tenant-supplied — the values below are the `demo` reference tenant (Rota Prime Seminovos), shown to ground the roles in real numbers. Every tenant re-defines all of them; only the roles and the usage rules are durable.

### Primary
- **Deep Route Blue** (`#0B3D91` in `demo`): the connective tissue of the UI — primary buttons, focus rings, text selection, links, and (optionally) the hero's own background. Never used decoratively; every appearance is either an action or an active/focus state.

### Secondary
- **Route Amber** (`#F59E0B` in `demo`): reserved for the site's single loudest accent per moment — the "Destaque" badge on a featured vehicle, an accent-toned CTA sitting on top of the primary-colored hero. It exists to be rare.

### Neutral
- **Cool Paper** (`#F6F7F9` in `demo`): page background.
- **Pure Surface** (`#FFFFFF` in `demo`): cards, header, inputs — anything that needs to read as "raised content" against the page background.
- **Ink Slate** (`#0F172A` in `demo`): primary text.
- **Quiet Slate** (`#5B6474` in `demo`): secondary text — specs, captions, muted labels.
- **Hairline** (`#E2E6EC` in `demo`): the only border color; used at 100% or blended via `currentColor/opacity` (e.g. `border-current/20` in dark contexts like the footer).
- **Deep Harbor** (`#0A1A33` in `demo`): footer background — deliberately dark even when the rest of a tenant's theme is light, so the footer always reads as the "close of the page" rather than inheriting page background.

### Fixed system colors (not tenant-configurable)
- **Signal Red** (`#DC2626`): danger/destructive states only (e.g. "Vendido" badge).
- **Signal Green** (`#16A34A`): success states.
- **WhatsApp Green** (`#25D366` / foreground `#062B14`): reserved exclusively for WhatsApp contact affordances (floating button, header CTA, vehicle-interest CTA). It reads as a utility/action color, structurally separate from the tenant's brand palette, and must never double as an accent or success color.

### Named Rules
**The One Stage, Many Lights Rule.** No component may hardcode a hex value belonging to one tenant. If a color needs to appear, it names a role (`bg-primary`, `text-muted-foreground`, …) and lets the active tenant's CSS variables answer.

## Typography

**Display/Headline Font:** an optional serif (`headingFont`: Playfair Display / Cormorant Garamond / Fraunces), falling back to the body sans in bold when a tenant doesn't set one.
**Body Font:** a variable sans (`font`: Inter / Montserrat / Outfit).

**Character:** the body face is a plain, confident grotesk built for density (specs, prices, forms); the optional serif display face is what turns the same layout editorial — a dealership that sets a serif immediately reads more premium without changing a single component.

### Hierarchy
- **Display** (weight 400 w/ serif or 700 w/o, `clamp(3rem, 6vw, 6rem)`, leading 0.98): the hero `<h1>` only. Enters with a 1s fade-up, 300ms into the hero's entrance sequence.
- **Headline** (same weight logic, `text-4xl sm:text-5xl`, leading 1.05): section titles (`SectionHeading`) — "Destaques da semana", "Por que comprar com a gente", etc.
- **Title** (700, `text-2xl`, leading tight): vehicle card model name and similar in-content headings; always in the sans face even when a serif display is set, since it doubles as a link target.
- **Body** (400, `text-base`–`text-lg`, leading-relaxed): descriptive copy. Hero subtitle caps at `max-w-xl`/`max-w-3xl` for measure.
- **Label** (600, `0.75rem`, `0.2em` tracking, uppercase — the `eyebrow` utility): section eyebrows, badges, footer block titles. Always paired with reduced opacity (60–80%) against its background, never full-contrast.

### Named Rules
**The Serif-Is-a-Register Rule.** `headingFont` is optional per tenant. No component may assume a serif is loaded; the fallback (bold sans, tighter tracking) must look intentional on its own, not like a missing font.

## Layout

Single content column capped at `max-w-7xl`, with responsive gutters (`px-4` → `sm:px-6` → `lg:px-8`) via the shared `Container`. Vehicle listings run a 1 → 2 → 3-column grid (`sm:grid-cols-2 lg:grid-cols-3`) with a noticeably taller row gap (`gap-y-12`) than column gap (`gap-x-6`), so cards read as individual showroom pieces rather than a dense table. The footer breaks into a 4-column grid on large screens (`1.4fr 1fr 1fr 1fr`) that collapses to 2 columns, then 1, going down. Section rhythm is generous and consistent: large vertical padding between major sections (`py-16` and up), `mb-10 sm:mb-14` between a section's heading and its content.

The header is the one structurally unusual piece: it overlaps the hero (`-mt-(--header-height)`) and starts fully transparent with the hero's own contrast-aware foreground color, then gains a solid background and shadow once the page scrolls past the hero (`[data-scrolled]`). This is why the hero component must declare `data-hero-overlay`/`data-hero-contrast` — the header has no visual identity of its own until it needs one.

Mobile gets a fixed sticky contact bar on the vehicle detail page, which reserves bottom padding on `<body>` and hides the floating WhatsApp button so the two never collide.

## Elevation & Depth

Flat by default. Cards, the header before scrolling, and page sections carry no resting shadow — depth is conveyed by surface-color contrast (`bg-surface` on `bg-background`) and a hairline border, not by drop shadow. Shadow is reserved for two situations only: a direct hover response (card lift, button hover) and a genuinely floating element that has no page position to rest on (the fixed WhatsApp button, the scrolled header).

### Shadow Vocabulary
- **Hover lift** (`shadow-lg` / `shadow-2xl shadow-black/10`): benefit cards and buttons on hover — pairs with a small `-translate-y-1` or `hover:brightness-11x`.
- **Floating element** (`shadow-lg shadow-black/25`): the fixed WhatsApp button — always present since the element has no resting page context.
- **Scrolled header** (`box-shadow: 0 10px 30px -18px rgb(0 0 0 / 0.35)`): appears only once `[data-scrolled]` is set.

### Named Rules
**The Flat-at-Rest Rule.** A shadow with no hover, focus, or fixed-position justification is a defect, not a style choice — add elevation only as a state response.

## Shapes

Corner radius is entirely tenant-driven, from `0` (sharp, e.g. `premium-example`) to a soft `0.75rem`+ (e.g. `demo`), scaled proportionally into `radius-sm/md/lg/xl` (0.5×/1×/1.5×/2× the base). Buttons are the one exception: they default to a fully-pill radius (`9999px`) regardless of the base radius, unless a tenant explicitly opts into `buttonShape: "rounded"` to match the base scale instead. Photography is always clipped to a fixed aspect (`aspect-[4/3]` on vehicle cards) inside a rounded container, never full-bleed-cropped inside a card.

### Named Rules
**The Pill-by-Default Rule.** Buttons read as pills unless a tenant deliberately asks for `"rounded"`; this is the strongest single silhouette cue that ties every reskin back to the same system.

## Components

### Buttons
- **Shape:** pill by default (`9999px`), or the tenant's base radius under `buttonShape: "rounded"`.
- **Primary:** `bg-primary`/`text-primary-foreground`, `hover:brightness-110` + `hover:shadow-lg`, `active:scale-[0.98]`. Sizes: sm (h-9), md (h-11), lg (h-13).
- **Accent:** same treatment on `bg-accent` — reserved for a single competing CTA next to a primary-colored surface (e.g. the hero's secondary action).
- **Outline / Ghost:** `border-border` + `bg-surface`, or transparent with a `hover:bg-foreground/5` wash — used for secondary actions that must not compete with primary/accent.
- **WhatsApp:** its own fixed-color variant (`bg-whatsapp`), never swapped for a tenant's accent color.
- **Overlay:** current-color outline for buttons sitting directly on a photo or colored hero, where `bg-surface` would be invisible.

### Badges
- **Shape:** pill, uppercase label type, `0.7rem` size.
- **Tones:** neutral (`foreground/8`), primary, accent, success, danger — accent is "Destaque" (featured), danger is "Vendido" (sold).

### Vehicle Card (signature component)
- **Image:** `aspect-[4/3]`, rounded, `object-cover`, scales to 1.06 over 1000ms on hover — deliberately slow, so the motion reads as quality rather than a UI reflex.
- **Status badges:** top-left overlay on the image (sold = danger, featured = accent).
- **Body:** eyebrow (brand) → title (model, doubles as the card's single focus target via a full-card `::after` link) → version → spec list (year/mileage/transmission, dot-separated) → price + a circular arrow affordance that inverts to primary color and rotates 45° on hover.
- **Whole-card link target:** exactly one focusable link per card (on the title), extended visually over the full card via `after:absolute after:inset-0` — never add a second nested link/button inside a card.

### Inputs / Fields
- **Style:** `border-border`, `bg-surface`, `rounded-md`, `h-11`.
- **Focus:** border shifts to primary + a soft `ring-primary/20`.
- **Error:** `aria-invalid` drives a `border-danger` state; error copy renders in `text-danger` below the field, linked via `aria-describedby`.

### Navigation (Header)
- **Style:** transparent + hero-foreground-colored while unscrolled over a hero; solid `bg-header`/`shadow` once scrolled. Logo swaps to a light (`on-dark`) variant automatically when sitting on a dark hero, via `data-logo-set="dual"`.
- **Mobile:** the floating WhatsApp button hides whenever the mobile menu is open, so nothing overlaps it.

### Footer
- **Background:** always the tenant's dedicated dark `footerBackground`/`footerForeground` pair, independent of whether the rest of the theme is light or dark — the footer is the one place every tenant reliably goes dark.
- **Structure:** 4-column grid (brand+social / address / hours / contact+nav), a "back to top" strip above it, and a copyright/admin-login strip below.

### Hero (signature component)
- **Overlay modes:** `image` (photo + Ken Burns + dual gradient scrim for legibility), `primary` (solid brand-colored background), `surface` (neutral background, primary-colored CTA) — chosen automatically from whether the tenant configured a `backgroundImage`.
- **No-photo fallback:** two large soft-blurred drifting color blobs plus a faint dot-grid mask, in `currentColor`, so it always matches the active theme without extra config.
- **Entrance:** eyebrow → title → subtitle → CTA row fade up in sequence at 150ms/300ms/450ms/600ms.

## Do's and Don'ts

### Do:
- **Do** resolve every color, radius, and button shape through the theme's CSS custom properties — never a literal hex or a hardcoded `rounded-lg`.
- **Do** treat shadow as a response to hover, focus, or genuine floating position — not a resting decoration.
- **Do** keep every animation degrading gracefully: instantly visible without JS, instant without motion preference.
- **Do** keep the WhatsApp green scoped to WhatsApp contact affordances only.

### Don't:
- **Don't** give a card, section, or header a resting shadow it hasn't earned through interaction or fixed positioning.
- **Don't** assume a serif `headingFont` is present — the bold-sans fallback must look deliberate.
- **Don't** add a second focusable link/button inside a `VehicleCard`; the whole-card link is the only target.
- **Don't** let a component read correctly for one tenant's palette and break for another's — that's a token leak, not a style variance.
