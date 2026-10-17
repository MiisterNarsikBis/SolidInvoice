# SolidInvoice Design System

> Repository conventions live in [`AGENTS.md`](../../AGENTS.md) — read it first. This file
> adds UI detail (tokens, component patterns, accessibility) that `AGENTS.md` §7 and §11
> summarise but do not carry. It does not restate conventions; where it touches one, it
> links. If this file and `AGENTS.md` disagree, `AGENTS.md` wins. The visual identity itself
> ("Ledger": colours, type, shape, contrast ratios, do/don't) is specified in
> [`DESIGN.md`](../../DESIGN.md), which is the reference for every value below.

**All UI changes MUST follow these guidelines.**

## The stack

The whole application is **Tailwind CSS** with this repository's Twig components. There is no
Tabler/Bootstrap left in a screen, so do not write any (`btn`, `card`, `row`/`col-*`, `modal`,
`navbar`, `data-bs-*`) and do not use Platform's `<twig:Ui:*>` components.

| | |
|---|---|
| Layouts | `Layout/shell.html.twig` (signed-in app), `focus.html.twig` (centred single-purpose page), `auth.html.twig` (card over the sign-in photo), all on `document.html.twig` |
| Stylesheet | `public/ui/app.css`, built from `assets/tailwind/app.css` by the Tailwind CLI |
| Components | `<twig:Si:*>` in `templates/components/Si/` |
| JS widgets | Stimulus: `si-dropdown`, `si-dialog`, `si-modal`, `si-tabs`, `si-drawer` |
| Tokens | the `@theme` block of `assets/tailwind/app.css` (the only copy) |
| Form theme | `Form/tailwind.html.twig`, global |

## Philosophy

"Ledger": Swiss-minimal, flat and ruled, dense but not cramped. One blue carries every primary
action; orange is a rare highlight. 14px body text, 36px controls, 8px grid, tabular figures
for money. Light only. Details and rationale: `DESIGN.md`.

## Tailwind screens

### Tokens

Use the theme tokens, never raw colours. The default Tailwind palette is switched off, so
`bg-blue-500` does not compile and an arbitrary `bg-[#123456]` defeats the point.

| Purpose | Tokens |
|---|---|
| Brand | `primary` `primary-hover` `primary-dark` `primary-light` `primary-lighter` |
| Rare highlight | `accent` (fill only), `accent-dark` (text), `accent-light` |
| Status | `success` `danger` `warning` `info`, each with `-dark` (text) and `-light` (tint) |
| Surfaces | `canvas` (page), `surface` (cards), `surface-hover`, `line`, `line-light` |
| Text | `fg`, `fg-secondary`, `fg-muted` |
| Neutrals | `ink-50` … `ink-900` (slate) |

Status colours are fills: set status **text** in the `-dark` step. Never carry status by colour
alone. Radii: `rounded-sm` 6px, `rounded-md` 8px (controls), `rounded-lg` 12px (cards),
`rounded-xl` 16px (modals). Type: `text-xs` 12, `text-sm` 13, `text-base` 14, `text-lg` 16,
`text-xl` 18, `text-2xl` 22 (page title), `text-3xl` 28. Use the `tabular` class (or a
`<table>`) wherever money or an ID is shown.

### Components (`templates/components/Si/`)

| Component | Use |
|---|---|
| `<twig:Si:Button>` | `variant` primary / secondary / outline / ghost / danger; `size` sm / md / lg; `href` makes it a link |
| `<twig:Si:Card>` | surface; with `title` / `subtitle` / `icon` it gets a ruled header and an `actions` block |
| `<twig:Si:Alert>` | inline message, `type` danger / success / warning / info |
| `<twig:Si:Badge>` | status pill with a dot, `tone` neutral / primary / success / danger / warning / info |
| `<twig:Si:Money>` | amount, `tone` neutral / muted / paid / overdue, `size` md / lg / xl |
| `<twig:Si:Stat>` | KPI tile: tinted icon, figure, label |
| `<twig:Si:Modal>` | native `<dialog>`; open with `data-si-modal-open="#id"`, close with `data-si-modal-close` |
| `<twig:Si:Tabs>` / `Tab` / `TabPanel` | client-side tabs, or `Tab href=` for links |
| `<twig:Si:FormSection>` / `FormActions` | a titled block of a form page and its pinned action bar |
| `<twig:Si:SettingsNav>` / `SettingRow` | a settings section's side navigation and its rows |
| `<twig:Si:EmptyState>` | "nothing here yet" |
| `<twig:Si:Field>`, `<twig:Si:PasswordField>` | labelled input with optional icon and error |
| `<twig:Si:Dropdown>` + `<twig:Si:MenuItem>` | disclosure menu (`si-dropdown` controller) |
| `<twig:Si:LogoutLink>` | CSRF-protected logout POST |

Pass already-translated strings as props; components never hard-code user-facing text. Write
every Tailwind class out in full (the scanner cannot see concatenated class names), and put a
repeated pattern in a component rather than copying utilities between templates.

```twig
{% extends '@SolidInvoiceCore/Layout/shell.html.twig' %}

{% block page_title %}{{ 'invoice.title'|trans }}{% endblock %}

{% block page_title_actions %}
    <twig:Si:Button href="{{ path('_invoices_create') }}">
        {{ ux_icon('tabler:plus', {class: 'size-4', 'aria-hidden': 'true'}) }}
        {{ 'invoice.create'|trans }}
    </twig:Si:Button>
{% endblock %}

{% block content %}
    <twig:Si:Card title="{{ 'invoice.list'|trans }}">
        <div class="p-5">...</div>
    </twig:Si:Card>
{% endblock %}
```

A component's slot compiles as its own template, so inside one `this`, `computed` and any
top-level `{% import %}` are **not** the page's. Capture what the slot needs in a variable
first (`{% set page = this %}`, `{% set total = macros.total(x) %}`), or avoid the component
boundary with a plain `<div>`.

Tests address elements by `data-*` hooks (`data-form-actions`, `data-hero-action`, ...), never by
a styling class: add an attribute rather than asserting on a utility.

### Interactivity without Bootstrap JS

| Need | Use |
|---|---|
| Menu / popover | `<twig:Si:Dropdown>` (`si-dropdown`: outside click, Escape, `aria-expanded`) |
| Modal, side panel | native `<dialog>` with `si-dialog` (`showModal()` gives the focus trap, Escape and `::backdrop`) |
| Collapsible group | native `<details>` / `<summary>`, no JS |
| Mobile navigation | `si-drawer` (the shell already wires it) |

### Forms

Visible label above the field, never placeholder-only; 36px input; error message below the
field in `danger-dark` with `aria-invalid`; help text `fg-muted`. Form actions: Cancel
(`ghost`/`outline`) on the left, the primary action with an icon on the right.

### Tables and lists

Header row: 12px/600 `fg-muted`, uppercase, on `canvas`. Rows ~40px with `line-light`
separators and `surface-hover` on hover; no zebra striping. Amounts right-aligned and
tabular. Wide tables scroll inside their container.

### Motion and accessibility

150ms colour transitions only; never animate layout properties. `prefers-reduced-motion` is
handled once in the base layer. Focus is a 2px `primary` outline on `:focus-visible` and is
never removed. Targets are 44px on touch devices (`pointer-coarse:`). Text contrast 4.5:1,
UI components 3:1.

## Key files

| File | Purpose |
|---|---|
| `DESIGN.md` | The identity: colour, type, shape, rules, contrast ratios |
| `/assets/tailwind/app.css` | Tailwind theme (`@theme`, the only copy of the tokens), base layer and the `.si-*` component classes |
| `/templates/components/Si/` | Tailwind Twig components |
| `/src/CoreBundle/Resources/views/Layout/shell.html.twig` | Tailwind application shell |
| `/src/CoreBundle/Resources/views/Menu/sidebar.html.twig` | Tailwind sidebar menu (KnpMenu template) |
| `/public/fonts-ui/` | Self-hosted Plus Jakarta Sans and its licence |
| `/assets/tailwind/design-templates.css` | The vocabulary of the customer-facing design templates (scoped; not for app screens) |
| `/src/CoreBundle/Resources/views/Form/tailwind.html.twig` | The global form theme |


## Checklist

1. Use `Si:*` components and Tailwind only; no Tabler/Bootstrap markup, no Platform `Ui:*` components.
2. Use tokens, never hardcoded colours or arbitrary values.
3. Status text uses the `-dark` step; status is never colour alone.
4. Money and IDs are tabular and right-aligned in columns.
5. Focus visible, labels on fields, 4.5:1 text contrast, 44px touch targets.
6. No user-facing text hard-coded in a component; add translation keys instead.
