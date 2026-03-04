# Mobile Responsiveness Report — Saved Souls Foundation (Next.js)

**Generated:** March 2025  
**Scope:** Full codebase analysis for mobile-first fixes.

---

## 1. Project structure overview

### 1.1 Pages (App Router only — no `pages/` directory)

- **Root:** `app/[locale]/page.tsx` (home)
- **Public:** 140+ pages under `app/[locale]/` including:
  - `donate/`, `donate/causes/`, `donate/thai/`
  - `contact/`, `about-us/`, `story/`, `blog/`, `blog/[slug]/`
  - `adopt/`, `adopt/dog/[id]/`, `adopt/cat/[id]/`, `adopt-inquiry/`
  - `volunteer/`, `volunteer-signup/`, `influencers/`, `kids/`, `shop/`
  - `shelters/`, `get-involved/`, `soul-saver/`, `clinic-renovation/`, `car-action/`
  - `faq/`, `disclaimer/`, `thank-you/`, `partners/`, `press/`, `gidsen/`
  - Content/gidsen: `behavior/`, `financial-overview/`, `vet-costs-comparison/`, `heartworm/`, etc.
  - `portal/`, `portal/vrijwilliger/`, `portal/adoptant/`, `portal/onboarding/`
  - `dashboard/`, `dashboard/login/`, `dashboard/update-password/`
- **Admin:** `app/[locale]/admin/(nieuw)/` — dashboard, adoptanten, vrijwilligers, leden, donateurs, sponsoren, agenda, rooster, emails, nieuwsbrief, sociale-media, documenten, login.

### 1.2 Major components

| Location | Components |
|----------|------------|
| `app/components/` | SiteHeader, FooterContent (Footer), NavDropdown, NavLogo, SiteSearch, LanguageSwitcher, ContactForm, TurnstileWidget, HeroFadeIn, TrustStatsBar, IdealDonate, BankTransferSection, RecentDonationsFooter, NewsletterSignup, CookieConsent, ParallaxPage, ScrollReveal, SpotlightSection, PressBanner(s), Thermometer, ProgressThermometer, VolunteerOnboarding, AdoptInquiryForm, SponsorForm, SponsorCheckout, KofiStyleDonate, FrostDonateCard, DonationCtaBlock, TiptapEditor, etc. |
| `components/` | PayPalDonate, NewsletterSignup |
| Admin clients | AdminLayoutClient, AdminDonateursClient, AdminLedenClient, AdminNieuwsbriefClient, AdminEmailsClient, AdminSponsorenClient, AdminAdoptantenClient, AdminVrijwilligersClient, AgendaClient, RoosterClient, SocialeMediaClient, DashboardClient, etc. |

### 1.3 CSS approach

- **Tailwind CSS 4** (`@tailwindcss/postcss`, `tailwindcss: ^4`) — primary styling via utility classes.
- **Plain CSS:** `app/globals.css` (Tailwind import, custom variants, hero animations, dropdown/menu keyframes, donate-cta pulse, print styles); `app/animations.css`.
- **Inline styles:** Used for brand colors (e.g. `#2aa348`, `#E53E3E`), borders, and some layout (e.g. `style={{ width: 50, height: 50 }}` in Footer).
- **No CSS modules, styled-components, or other CSS-in-JS** in the project.

---

## 2. Mobile responsiveness issues (by file)

### 2.1 Layout & shell

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/components/FooterContent.tsx` | Fixed size logo container | `style={{ width: 50, height: 50 }}` | Fine on mobile; consider responsive if logo scales. |
| `app/components/FooterContent.tsx` | Footer nav grid | `grid-cols-2 md:grid-cols-2 lg:grid-cols-4` | 2 cols on mobile can feel cramped; consider single column on very small screens. |
| `app/[locale]/admin/(nieuw)/AdminLayoutClient.tsx` | Sidebar width fixed | `w-56` (desktop), `w-64 max-w-[85vw]` (mobile overlay) | Mobile sidebar OK; desktop `w-56` is fixed. |
| `app/[locale]/admin/(nieuw)/AdminLayoutClient.tsx` | Hamburger / touch target | `className="p-2 rounded"` for menu button | Only `p-2` (~32px); below 44px recommended for touch. |

### 2.2 Fixed widths & min-widths (overflow / horizontal scroll risk)

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/[locale]/vet-costs-comparison/page.tsx` | Table min-width | `min-w-[500px]`, `min-w-[600px]`, `minWidth: 140` on th | Tables force horizontal scroll on small screens; wrapper has `overflow-x-auto` (good) but no card/stack fallback for mobile. |
| `app/[locale]/admin/(nieuw)/rooster/RoosterClient.tsx` | Rooster table | `min-w-[800px]`, `w-[140px]` first column, `min-w-[100px]` cells | Desktop-only table; on small desktop/large tablet can still overflow. |
| `app/[locale]/admin/(nieuw)/agenda/AgendaClient.tsx` | Agenda grid | `min-w-[400px]`, `min-w-[600px]` with fixed columns | Horizontal scroll on narrow viewports. |
| `app/components/NavDropdown.tsx` | Dropdown panel | `min-w-[280px]` | OK for mobile (dropdown is desktop-only). |
| `app/components/LanguageSwitcher.tsx` | Dropdown | `min-w-[140px]` | OK. |
| `app/components/TurnstileWidget.tsx` | Widget container | `min-w-[280px] sm:min-w-[300px]` | Responsive; OK. |
| `app/[locale]/admin/(nieuw)/emails/AdminEmailsClient.tsx` | Search input | `min-w-[200px]` | Can squeeze on very small admin screens. |
| `app/[locale]/admin/(nieuw)/donateurs/AdminDonateursClient.tsx` | Search input | `min-w-[200px]` | Same. |
| `app/[locale]/admin/(nieuw)/leden/AdminLedenClient.tsx` | Search input | `min-w-[200px]` | Same. |
| `app/[locale]/admin/(nieuw)/sponsoren/AdminSponsorenClient.tsx` | Search input | `min-w-[200px]` | Same. |
| `app/[locale]/admin/(nieuw)/nieuwsbrief/AdminNieuwsbriefClient.tsx` | Search input | `min-w-[200px]` | Same. |
| `app/[locale]/admin/(nieuw)/emails/templates/AdminEmailTemplatesClient.tsx` | Search | `min-w-[180px]` | Same. |
| `app/components/PressBanner.tsx` | Image column | `w-1/3 min-w-[200px]` | On narrow screens 1/3 + min-width can cause overflow or squashed text. |
| `app/[locale]/portal/adoptant/page.tsx` | Image width | `w-[25%] max-w-[180px]` | Percentage + max can be small on mobile. |
| `app/components/ShareStoryButton.tsx` | Tooltip panel | `min-w-[200px]` | OK for overlay. |
| `app/components/SiteSearch.tsx` | Input | `min-w-[140px] max-w-[200px]` | May be tight on very small screens. |
| `app/components/IdealDonate.tsx` | Currency select | `w-28 shrink-0` | Fixed width; on very narrow screens amount + currency row could wrap awkwardly. |

### 2.3 Typography & font sizes

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/[locale]/page.tsx` | Hero headline | `style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}` | Good (fluid). |
| `app/[locale]/vet-costs-comparison/page.tsx` | Hero title | `text-4xl md:text-6xl` | Large on mobile; consider `text-3xl` or clamp for very small screens. |
| Various admin tables | Cell text | `text-sm`, `truncate` | OK; truncation can hide content without tooltip on some rows. |

### 2.4 Padding / margin / spacing

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/[locale]/volunteer-signup/page.tsx` | Form container | `p-8 md:p-10` | On small screens `p-8` may be heavy; consider `p-4 sm:p-6 md:p-10`. |
| `app/[locale]/donate/page.tsx` | Main | `max-w-md mx-auto px-4 py-12 md:py-16` | OK. |
| Admin main | Content area | `p-4 md:p-6 lg:p-8` | OK. |

### 2.5 Images

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| Multiple pages | Next/Image | `sizes="(max-width: 768px) 100vw, ..."` used consistently | Good. |
| `app/[locale]/page.tsx` | Hero picture | `<source media="(max-width: 767px)" />` + mobile image | Good. |
| `app/[locale]/donate/thai/page.tsx` | Square blocks | `max-w-[220px]` | Constrains size; OK. |
| `app/[locale]/feed-a-year/page.tsx` | Circles | `max-w-[220px]` | OK. |

### 2.6 Flex / grid not adapting

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/[locale]/page.tsx` | Hero CTAs | `flex flex-col sm:flex-row gap-4` | Stacks on mobile; good. |
| `app/[locale]/page.tsx` | Support section buttons | `flex flex-col sm:flex-row gap-4` | Good. |
| `app/[locale]/page.tsx` | Photo strip | `grid grid-cols-4 gap-1 h-[160px] md:h-[200px]` | 4 cols on mobile; could stay 4 or go 2x2 with larger tap targets. |
| `app/[locale]/admin/(nieuw)/rooster/RoosterClient.tsx` | Volunteers panel | `hidden lg:flex ... w-[220px]` | Hidden on mobile; mobile uses different UI. |
| `app/components/FooterContent.tsx` | Nav | `grid grid-cols-2 ... lg:grid-cols-4` | 2 cols on mobile; links can be small. |
| Admin tables (donateurs, leden, emails, etc.) | Table layout | No responsive card view | Tables scroll horizontally; no stacked card alternative on mobile. |

### 2.7 Overflow

| File | Issue | Line(s) / className | Notes |
|------|--------|---------------------|--------|
| `app/[locale]/admin/(nieuw)/rooster/RoosterClient.tsx` | Table wrapper | `overflow-auto` | Allows horizontal scroll; no mobile-specific layout. |
| `app/[locale]/vet-costs-comparison/page.tsx` | Table wrapper | `overflow-x-auto` | Same. |
| `app/components/SiteHeader.tsx` | Nav | `overflow-visible` | For dropdowns; OK. |
| Long content (e.g. blog, disclaimer) | Text | No `overflow-wrap` or `word-break` on all containers | Rare; most content is paragraph-based. |

---

## 3. Navigation & header

### 3.1 Mobile menu / hamburger

- **Yes.** `app/components/SiteHeader.tsx`:
  - Desktop: nav links + dropdowns in center, search + language + donate on the right.
  - Mobile: nav links hidden (`hidden md:flex`); hamburger button visible (`flex md:hidden`) that toggles `mobileMenuOpen`.
  - Mobile menu: full-width panel below header (`top-14`), with sections (ONTDEK, DOE MEE, MEER), card-style links, and bottom CTA (Doneren).
  - Backdrop: `fixed inset-0 top-14 z-[45]` with `bg-black/40`; closes menu on click.

### 3.2 Nav collapse on small screens

- **Yes.** Main nav collapses into hamburger below `md` (768px). Logo and “Saved Souls” stay visible; search and language switcher remain in header on mobile; donate is only in the opened mobile menu (not in header on mobile).

---

## 4. Forms and buttons

### 4.1 Touch-friendly targets (min 44px height)

| File | Element | Current | Issue |
|------|--------|--------|--------|
| `app/components/ContactForm.tsx` | Inputs | `py-2` (~32px total height) | Below 44px; consider `min-h-[44px]` or `py-3`. |
| `app/components/ContactForm.tsx` | Submit button | `py-3` | ~44px with padding; OK. |
| `app/components/BankTransferSection.tsx` | CopyButton | `px-3 py-1.5` | Small; consider `min-h-[44px]`. |
| `app/[locale]/admin/(nieuw)/AdminLayoutClient.tsx` | Hamburger | `p-2` | ~32px; should be at least 44px (e.g. `p-3` or `min-h-[44px] min-w-[44px]`). |
| Admin tables | Row actions (buttons) | `px-4 py-2`, `px-3 py-2` | Often below 44px height. |
| `app/components/SiteSearch.tsx` | Search icon button | `min-w-[48px] min-h-[48px]` | OK. |
| `app/[locale]/contact/page.tsx` | Tel links | `min-h-[44px] min-w-[44px]` | OK. |
| Many admin forms (ShiftModal, SocialeMedia, Nieuwsbrief, etc.) | Inputs / buttons | `py-2`, `px-3 py-1.5` | Consistently below 44px; improve for touch. |

### 4.2 Forms stacking vertically on mobile

- **ContactForm:** Single column, full width (`max-w-xl mx-auto`, `w-full` on inputs); stacks vertically. OK.
- **IdealDonate:** Single column; amount and currency in one row (`flex gap-2`); on very narrow screens row may wrap. Consider stacking amount above currency on small screens.
- **Volunteer signup:** Form in one column; layout is vertical. OK.
- **NewsletterSignup:** Layout depends on variant; compact is inline; expanded stacks. OK.
- **Admin forms:** Most are single column or grid; some admin filters (search + buttons) stay in one row and can get cramped on small screens.

---

## 5. Donation flow

### 5.1 Donorbox embed

- **There is no Donorbox embed** in the project. Donation options are:
  - **iDEAL / Mollie** via `IdealDonate` (form with amount + currency, redirect to Mollie).
  - **PayPal** link (`PayPalDonate` component and `paypal.me/savedsoulsfoundation`).
  - **Bank transfer** via `BankTransferSection` (expandable details + copy buttons).

### 5.2 Donate page on mobile

- **File:** `app/[locale]/donate/page.tsx`
- **Layout:** `ParallaxPage` with `max-w-md mx-auto px-4 py-12 md:py-16`; single column.
- **Sections:** Header image (`w-48 h-48`), title, IdealDonate, PayPalDonate, RecentDonations, BankTransferSection, links.
- **Responsive:** Uses responsive image, `text-3xl md:text-4xl` for title; no fixed widths that break layout. IdealDonate uses `max-w-sm mx-auto` and full-width button.
- **Verdict:** Works well on mobile; main improvement is ensuring all buttons/inputs in IdealDonate and BankTransferSection meet 44px min height where applicable.

---

## 6. Quick fix list — TOP 10 (prioritized)

### Fix 1 — Admin sidebar hamburger touch target (high impact: admin mobile)

- **File:** `app/[locale]/admin/(nieuw)/AdminLayoutClient.tsx`
- **Line:** ~257–264 (mobile header hamburger button)
- **Current:** `className="p-2 rounded"` (and inner `text-xl` icon)
- **Suggested:**  
  `className="p-3 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"`  
  so the tap target is at least 44×44px.

---

### Fix 2 — Contact form inputs touch-friendly (high impact: public contact)

- **File:** `app/components/ContactForm.tsx`
- **Lines:** Input/textarea classes (e.g. ~102, 118, 132, 148), submit ~165
- **Current:** `py-2` on inputs, `py-3` on submit
- **Suggested:**  
  For all inputs and textarea add `min-h-[44px]` (or use `py-3`). Example:  
  `className="... px-4 py-3 min-h-[44px] rounded-lg ..."` for inputs, and keep or increase submit to `py-3` / `min-h-[48px]`.

---

### Fix 3 — Vet costs comparison tables: mobile card fallback (high impact: content)

- **File:** `app/[locale]/vet-costs-comparison/page.tsx`
- **Lines:** 64 (first table), 174 (second table)
- **Current:**  
  `<div className="overflow-x-auto ..."><table className="w-full min-w-[500px]">`  
  and second table `min-w-[600px]`, th `style={{ minWidth: 140 }}`.
- **Suggested:**  
  Keep `overflow-x-auto` for table. Add a `md:hidden` block that renders the same data as cards (e.g. one card per row: condition + NL price + TH price) and hide the table on small screens with `hidden md:block`. This avoids horizontal scroll on phones.

---

### Fix 4 — Volunteer signup form padding on small screens (medium impact)

- **File:** `app/[locale]/volunteer-signup/page.tsx`
- **Line:** ~98 (form container)
- **Current:** `p-8 md:p-10`
- **Suggested:**  
  `p-4 sm:p-6 md:p-10` to reduce padding on very small screens and avoid cramped content.

---

### Fix 5 — BankTransferSection copy buttons touch-friendly (medium impact)

- **File:** `app/components/BankTransferSection.tsx`
- **Line:** ~24–27 (CopyButton)
- **Current:** `className="px-3 py-1.5 rounded-lg ..."`
- **Suggested:**  
  `className="... min-h-[44px] px-4 py-2.5 rounded-lg ..."` so buttons meet 44px height.

---

### Fix 6 — Rooster admin: table horizontal scroll hint on small desktop (medium impact)

- **File:** `app/[locale]/admin/(nieuw)/rooster/RoosterClient.tsx`
- **Line:** ~448–449 (table wrapper)
- **Current:** `className="hidden lg:block overflow-auto"` and table `min-w-[800px]`.
- **Suggested:**  
  Keep as is for layout. Optionally add a short hint above the table (e.g. “Scroll horizontally on small screens”) with `lg:hidden` or only when viewport width &lt; 1024px, so users know to scroll.

---

### Fix 7 — Footer nav: single column on very small screens (low–medium impact)

- **File:** `app/components/FooterContent.tsx`
- **Line:** ~106 (nav)
- **Current:** `grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4`
- **Suggested:**  
  `grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4` if you have an `xs` breakpoint, or at least ensure 2 columns don’t make links too small (e.g. increase tap area with padding). Alternatively use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for one column on the smallest phones.

---

### Fix 8 — IdealDonate currency/amount row on narrow screens (low impact)

- **File:** `app/components/IdealDonate.tsx`
- **Lines:** ~149–189 (amount + currency row)
- **Current:** `flex gap-2` with `flex-1 min-w-0` and `w-28 shrink-0`.
- **Suggested:**  
  On very narrow screens, stack: e.g. `flex flex-col sm:flex-row gap-2` so amount is full width and currency select below (or full width), avoiding cramped row.

---

### Fix 9 — Admin list search inputs on very small screens (low impact)

- **File:** Any of: `AdminDonateursClient.tsx`, `AdminLedenClient.tsx`, `AdminNieuwsbriefClient.tsx`, `AdminSponsorenClient.tsx`, `AdminEmailsClient.tsx`
- **Example line:** `AdminDonateursClient.tsx` ~242
- **Current:** `className="... min-w-[200px] max-w-md ..."`
- **Suggested:**  
  Allow search to shrink more on small screens: e.g. `min-w-0 sm:min-w-[200px] max-w-md` so the row doesn’t overflow.

---

### Fix 10 — PressBanner image column (low impact)

- **File:** `app/components/PressBanner.tsx`
- **Lines:** ~192–193
- **Current:** `w-1/3 min-w-[200px]` and inner `max-w-[220px]`.
- **Suggested:**  
  On mobile, make image full width or stacked: e.g. wrapper `w-full md:w-1/3 min-w-0 md:min-w-[200px]` and ensure the other column doesn’t force overflow (e.g. `min-w-0` on text column).

---

## Summary

- **Structure:** App Router only, 140+ pages, Tailwind + minimal plain CSS, no Donorbox (Mollie, PayPal, bank transfer).
- **Navigation:** Mobile menu and hamburger are present; nav collapses below `md`.
- **Donate page:** Responsive and usable on mobile; no Donorbox; focus on touch targets and IdealDonate/BankTransferSection.
- **Main issues:** Touch targets &lt; 44px (admin hamburger, contact inputs, bank copy buttons, many admin buttons), wide tables without mobile card fallback (vet-costs), and a few fixed/min-widths that can be relaxed or made responsive (footer, admin search, IdealDonate row, PressBanner).

Applying the top 10 fixes above will noticeably improve mobile and touch usability while keeping the current design and behavior intact.
