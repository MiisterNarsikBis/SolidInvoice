---
name: SolidInvoice
description: Open-source, self-hostable invoicing for freelancers and small businesses. Visual identity "Ledger".
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-dark: "#1e40af"
  primary-light: "#dbeafe"
  primary-lighter: "#eff6ff"
  accent: "#ea580c"
  accent-dark: "#c2410c"
  accent-light: "#ffedd5"
  success: "#16a34a"
  success-dark: "#15803d"
  success-light: "#dcfce7"
  danger: "#dc2626"
  danger-dark: "#b91c1c"
  danger-light: "#fee2e2"
  warning: "#f59e0b"
  warning-dark: "#92400e"
  warning-light: "#fef3c7"
  info: "#0891b2"
  info-dark: "#0e7490"
  info-light: "#cffafe"
  canvas: "#f8fafc"
  surface: "#ffffff"
  surface-hover: "#f1f5f9"
  line: "#e2e8f0"
  line-light: "#eef2f6"
  fg: "#1e293b"
  fg-secondary: "#475569"
  fg-muted: "#5b6779"
  ink-900: "#0f172a"
typography:
  fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', roboto, sans-serif"
  scale:
    xs: "0.75rem"
    sm: "0.8125rem"
    base: "0.875rem"
    lg: "1rem"
    xl: "1.125rem"
    2xl: "1.375rem"
    3xl: "1.75rem"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
---

# Design System: SolidInvoice — "Ledger"

> **Implementation stack.** The whole application is built with **Tailwind CSS** and the
> repository's `<twig:Si:*>` Twig components. The tokens below are the `@theme` block of
> `assets/tailwind/app.css`, the only copy. Rules for working in it: `AGENTS.md` §7 and §11.

## 1. Overview

**Direction: Swiss-minimal ledger.** SolidInvoice is a daily work tool for people who would
rather be doing something else. It should feel like a well-kept ledger: ruled, quiet, exact.
Content carries the page; the interface gets out of the way.

- **Flat and ruled.** Hairline borders separate things; shadows are reserved for overlays
  (menus, modals, popovers). No decorative gradients, glass or glow.
- **Dense, not cramped.** 14px body text, 36px controls, 8px grid. A page of invoices shows
  many rows without feeling heavy.
- **One blue.** Trust blue is the only brand colour and carries every primary action. Orange
  is an occasional highlight, never a second brand colour.
- **Numbers are first-class.** Money and IDs use tabular figures so columns align.
- **Light only.** Dark mode is out of scope; there is no `data-theme`/`data-bs-theme` switch.
  If one is added later, the dark values must be designed, not inverted.

The source for this direction is the UI/UX Pro Max design-system search for a B2B invoicing
SaaS (style *Minimalism & Swiss*, density 8/10, variance 3/10, motion 2/10), adjusted by hand
where noted.

## 2. Colour

Every text colour below is checked against white, the `canvas` and a hovered table row
(`surface-hover`). Ratios are WCAG 2.x contrast.

### Brand

| Token | Value | Use | On white |
|---|---|---|---|
| `primary` | `#2563eb` | Primary buttons, links, focus ring, selected state | 5.17:1 (text and white-text fill) |
| `primary-hover` | `#1d4ed8` | Hover | 6.70:1 |
| `primary-dark` | `#1e40af` | Pressed; text on `primary-light`/`-lighter` | 8.72:1 |
| `primary-light` | `#dbeafe` | Selected row, tag background | — |
| `primary-lighter` | `#eff6ff` | Active nav pill, ambient tint | — |

`accent` (`#ea580c`) is a **fill only** (3.56:1). Accent text uses `accent-dark` (`#c2410c`,
5.18:1). Use it for at most one highlight per screen.

### Status

Status colours are fills (icons, dots, borders, chip backgrounds). Status **text** uses the
`-dark` step.

| Meaning | Fill | Text (`-dark`) | Text on its `-light` tint |
|---|---|---|---|
| Success / Paid | `#16a34a` | `#15803d` (5.02:1) | 4.57:1 |
| Danger / Overdue | `#dc2626` | `#b91c1c` (6.47:1) | 5.30:1 |
| Warning / Due soon | `#f59e0b` | `#92400e` (7.09:1) | 6.37:1 |
| Info / Draft | `#0891b2` | `#0e7490` (5.36:1) | 4.79:1 |

### Neutrals (slate)

| Token | Value | Use | On white / canvas / row |
|---|---|---|---|
| `canvas` | `#f8fafc` | Application background | — |
| `surface` | `#ffffff` | Cards, sidebar, inputs, modals | — |
| `surface-hover` | `#f1f5f9` | Row and menu hover | — |
| `line` / `line-light` | `#e2e8f0` / `#eef2f6` | Borders / row separators | — |
| `fg` | `#1e293b` | Body text, headings | 14.63 / 13.98 / 13.35 |
| `fg-secondary` | `#475569` | Labels, secondary text | 7.58 / 7.24 / 6.92 |
| `fg-muted` | `#5b6779` | Help text, captions, placeholders | 5.74 / 5.48 / 5.24 |

`ink-400` (`#94a3b8`, 2.56:1) fails AA and is for disabled text and decoration only. Never
use it for a placeholder or any meaningful text.

### Rules

**The One Blue Rule.** Blue means "you can act here" or "this is selected". If blue covers
more than about 10% of a screen it is being overused.

**The Legible Status Rule.** Never set status text in the fill colour; use the `-dark` step.
Never carry status by colour alone: pair it with a label or an icon.

**The Money-Colour Rule.** Colour on money is informational. Green (`success-dark`) means
Paid, red (`danger-dark`) means Overdue, everything else (Draft, Sent, Pending) is `fg`.

**The Palette Is Closed.** Templates use the theme tokens only. No `bg-blue-500`, no
`#123456`, no arbitrary values where a token exists (the default Tailwind palette is switched
off, so the first two simply do not compile).

## 3. Typography

**Plus Jakarta Sans**, self-hosted from `public/fonts-ui/` (SIL OFL; no third-party font
CDN, so a self-hosted install does not leak its users' IPs). Fallback: the system UI stack.

| Role | Size | Weight |
|---|---|---|
| Page title | 22px (`2xl`) | 600, tracking -0.015em |
| Card / section title | 16px (`lg`) | 600 |
| Body, table cells, inputs | 14px (`base`) | 400 |
| Labels, buttons, nav | 14px (`base`) | 500 |
| Help text, captions | 13px (`sm`) | 400, `fg-muted` |
| Table headers, badges | 12px (`xs`) | 600, uppercase tracking for headers |

- **Tabular figures everywhere money or an ID is shown** (`font-variant-numeric:
  tabular-nums`; the `tabular` class, and `<table>` by default).
- Right-align amounts. Show the currency as a quiet unit next to the figure, not a second
  number.
- Body line length 65–75ch for prose. Line height 1.5 for body, 1.2–1.4 for headings.

## 4. Shape, spacing, elevation

- **Radius:** `sm` 6px (badges, small items), `md` 8px (buttons, inputs, nav pills), `lg`
  12px (cards), `xl` 16px (modals). Pills only for status badges.
- **Spacing:** 4px base, 8px rhythm. Controls are 36px high (32px for `sm`); table rows
  ~40px. On touch devices (`pointer: coarse`) every control is at least 44px.
- **Elevation:** cards are flat with a `line-light` border and `shadow-sm` at most.
  `shadow-md` for dropdowns, `shadow-lg` for modals and popovers.
- **Motion:** 150ms colour/background transitions only. Nothing animates layout properties.
  `prefers-reduced-motion` reduces everything to ~instant (set once in the base layer).

## 5. Components

### Sidebar

Light and compact: `surface` background, 1px `line` right border, 224px wide. Rows are
~36px (14px/500 text, 18px icon, 8px radius). Active route: `primary-lighter` pill with
`primary-dark` text (8.01:1). Hover: `surface-hover`. Sub-menus open inline, indented, with a
hairline on the left; no card chrome. The company name stays visible in the brand area at
all times (multi-tenant safety).

### Buttons

36px high, 8px radius, 14px/500 text. `primary` (blue, white text), `secondary` (slate-800,
white text), `outline` (`surface`, `line` border), `ghost` (text only), `danger`
(`danger-dark`). One primary button per view. Disabled: 50% opacity, no pointer events.

### Forms

Visible label above the field (13px/500, `fg-secondary`), never placeholder-only.
36px input, `line` border, `surface` background, 8px radius. Focus: border `primary` plus
the global 2px ring. Error: `danger` border, message below in `danger-dark`, `aria-invalid`.
Help text 13px `fg-muted`. Password fields have a show/hide toggle.

### Tables and data

Header row: 12px/600 `fg-muted`, uppercase, on `canvas`. Rows ~40px, `line-light`
separators, `surface-hover` on hover, no zebra striping. Numeric columns right-aligned and
tabular. Wide tables scroll horizontally inside their container rather than breaking the
page.

### Cards

`surface`, 12px radius, 1px `line-light` border, `shadow-sm`. Padding is chosen by the
caller (24px typical, 0 when the card holds a table edge to edge). Do not wrap a lone piece
of content in a card just because it is there.

### Status badges

Pill, 12px/600, `-dark` text on the `-light` tint, with a leading dot in the fill colour:
Paid (success), Overdue (danger), Due soon (warning), Draft/Sent (info or neutral). The label
is always present.

### Modals

`surface`, 16px radius, `shadow-lg`, 24px padding, backdrop `ink-900` at 55% (not pure
black), constrained width.

## 6. Accessibility

- Text contrast 4.5:1 minimum (see §2); large text and UI components 3:1.
- **Focus is always visible.** A 2px `primary` outline with a 2px offset on
  `:focus-visible` (keyboard only). Never `outline: none` without a replacement.
- Interactive targets 44px on touch devices.
- Status is never colour alone; icon-only buttons carry an accessible name.
- Respect `prefers-reduced-motion`.

## 7. Do and don't

**Do**

- Build from the theme tokens and the `<twig:Si:*>` components.
- Put repeated patterns in a component, not copy-pasted utilities.
- Keep the active company visible.
- Use `font-variant-numeric: tabular-nums` for every money column and ID.

**Don't**

- Don't add shadows, gradients, glass or glow for decoration.
- Don't use a second brand colour, or orange for anything but a rare highlight.
- Don't use `ink-400` for text a user needs to read.
- Don't rely on colour alone for status.
- Don't animate layout properties; don't use bounce or elastic easing.
- Don't add Tabler/Bootstrap markup: there is none left in the app.

## 8. Colour literals outside the tokens

A few colours cannot read a CSS custom property and are kept as literals. Change them
together with the tokens; this list is what to grep against.

- `assets/controllers/global-search_controller.ts` — `ICON_COLORS` (inline SVG colours).
- `src/DashboardBundle/Widgets/RevenueChartWidget.php` — Chart.js dataset colours; the
  rendered markup is snapshot-tested (`RevenueChartWidgetTest__*__1.html`), update both.
- `assets/tailwind/design-templates.css` — the neutral colours of the customer-facing design
  templates (they are the company's look, not the theme's).
- **Not yet on Ledger** (still on the original green/amber palette): the logo, PDFs
  (`pdf.scss`, `Pdf/*.twig`), emails (`email/*`, `Layout/Email`, `Onboarding/*`) and the
  invoice/quote document templates (`Templates/{compact,studio}`). These are customer-facing
  output, so changing them is a product decision, not a theme change.
