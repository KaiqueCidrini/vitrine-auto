# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both material to design decisions:

- **Car buyers (site visitors):** browse a dealership's inventory, filter by attributes, view photos and technical specs, and contact a salesperson via WhatsApp with a message pre-filled with the vehicle name, price, and link. Often on older Android phones or weaker mobile data.
- **Dealership employees (managers/sellers):** use a restricted admin panel to register and manage vehicle listings, upload photos, and manage team accounts. Managers additionally manage staff.

## Product Purpose

A resold, multi-tenant inventory website for car dealerships (concessionárias). One shared codebase serves many independent dealership clients; each gets its own visual identity by swapping a single tenant configuration file (colors, fonts, logo, contact info, WhatsApp copy, home page section order). Success means a dealership's visitors can find a car and reach a salesperson with minimal friction, and the dealership can run its own storefront without touching code.

## Positioning

WhatsApp-first sales flow: browsing inventory converts directly into a pre-filled WhatsApp message to a salesperson (vehicle name, price, link already in the text). This matches how Brazilian buyers actually shop and reach dealerships, rather than a generic contact form or lead-gen funnel. This is the primary differentiator over a generic site builder or one-off agency build; full per-tenant visual customization on a single shared codebase is the secondary one (cheap to re-skin, not cheap to rebuild).

## Operating Context

- **Business model:** reseller/agency product. The team sells the same codebase to multiple independent dealership clients; no dealership is currently a paying client — current tenants (`demo`, `premium-example`) are fictitious, used for development and to pitch prospective clients.
- Each dealership is deployed as its own isolated instance (one deploy per client — see README "Decisões técnicas"), not a shared multi-tenant runtime.
- Onboarding a new client is: copy a tenant folder, fill in the config, add the client to the tenant registry, provide the logo asset, deploy.
- Visitors reach listings through search engines and direct links; employees log into `/admin` to manage stock.

## Capabilities and Constraints

- Next.js (App Router, Server Components, Server Actions) + React + TypeScript, Tailwind CSS with a CSS-variable theme, PostgreSQL + Drizzle, Better Auth (no public signup — only manager/seller accounts).
- Photos are resized client-side before upload, converted to WebP and stripped of EXIF server-side (`sharp`), stored on local disk, Vercel Blob, or S3/R2.
- Everything that varies per dealership lives in `src/tenants/`; UI code must use theme tokens (`bg-primary`, `text-foreground`, …), never hardcoded brand colors.
- Pages render per-request (stock changes constantly, traffic volume per dealership is low); images are optimized/cached via `next/image`.
- Money is stored in cents, never floating-point.
- **Slow connections / low-end phones are a known real-world constraint**: a meaningful share of buyers browse on older Android devices or weaker mobile data. Keep pages light, avoid heavy client-side payloads, and don't regress load performance for visual polish.
- Interface text, comments, and public URLs are in Portuguese; code identifiers are in English.

## Brand Commitments

"Vitrine Auto" is the internal/dev product name, not a name shown to end visitors — each deployed dealership presents its own name, logo, and color scheme, resolved entirely through tenant config. There is no single end-customer-facing brand identity to preserve across tenants; the design system must stay tenant-agnostic (token-driven) rather than carrying any one dealership's look as default.

## Evidence on Hand

- Two example tenant configs exist and are the primary visual reference for how differently the theme system can be skinned: `src/tenants/demo/` (Rota Prime Seminovos — blue/amber, Inter + Playfair Display, pill buttons) and `src/tenants/premium-example/`. Both are fictitious, built for demonstration, not real dealership content.
- No real client testimonials, case studies, or usage data exist yet — this product is pre-first-sale. Do not fabricate them.

## Product Principles

- WhatsApp is the conversion mechanism, not an afterthought — every vehicle-facing surface should make "message a seller about this exact car" the easiest next action.
- Design tenant-agnostic: every visual decision must work believably reskinned across very different palettes/fonts, since the same code ships to dealerships with distinct identities.
- Assume the visitor's connection and device are the weak link — resist heavy client-side weight in exchange for visual richness.
- The admin panel serves working, possibly non-technical dealership staff — favor clarity and low friction over cleverness there (see Operate mode).
- Keep money, photos, and tenant identity handled through their existing constrained paths (cents, sharp pipeline, tenant config) rather than introducing parallel ways to represent the same thing.

## Accessibility & Inclusion

No formal accessibility standard has been mandated. Known real-world constraint: buyers browsing on older Android phones or slower mobile connections, which the design must remain fast and light for (see Capabilities and Constraints).
