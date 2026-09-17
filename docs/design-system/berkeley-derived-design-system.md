# Berkeley MDes–Derived Design System

This document records a design-system extraction from `https://design.berkeley.edu/` performed on September 16–17, 2026. It is an implementation reference for the Therapeutic Letter Writer, not a reproduction of Berkeley branding.

## Extraction method and sources

The reference was reverse-engineered from the site's delivered implementation rather than estimated from screenshots alone.

- Parsed the live page DOM, element hierarchy, class frequency, headings, navigation, forms, and repeated listing structures.
- Parsed the linked theme CSS, shared editor CSS, and Bootstrap CSS for color, type, spacing, borders, radii, shadows, transitions, and media queries.
- Inspected targeted rules for navigation, headings, buttons, form fields, listing cards, calls to action, and footer patterns.
- Rendered the live site in headless Chrome at `1440 × 1100` and `390 × 844` to validate desktop and mobile behavior.

Primary implementation sources:

- `https://design.berkeley.edu/`
- `/wp-content/themes/wp-boostrap-jacobs/style.css?ver=7.0.4`
- `/wp-content/themes/wp-boostrap-jacobs/editor-style-shared.css`
- `/wp-content/themes/wp-boostrap-jacobs/inc/assets/css/bootstrap.min.css?ver=7.0.4`

## Design character

The system is bold, editorial, technical, and intentionally high contrast. It combines very large grotesk typography, pure digital blue, fluorescent yellow highlights, square blue rules, mono metadata, and nearly shadowless surfaces. Movement is simple and graphic: elements change color and lift slightly rather than gaining depth through shadows.

## Color palette

These values were extracted directly from the delivered CSS.

| Token | Value | Role in the reference | Translation in this app |
| --- | --- | --- | --- |
| `signal-blue` | `#0000ff` | Links, borders, headings, navigation, fields | Primary action, focus, structure, active state |
| `signal-yellow` | `#ffff00` | Highlighted headings, hover backgrounds, validation fields | Active stage, selected state, important guidance |
| `signal-red` | `#ff1402` | Error and alert text | Destructive and error state only |
| `ink` | `#000000` | Primary text and dark contrast | Body text and inverse surfaces |
| `paper` | `#ffffff` | Main surface | Page, panel, and document surface |
| `line` | `#d6d6d6` | Secondary rules and inactive borders | Quiet border and disabled state |
| `wash` | `#eeeeee` / `#f1f1f1` | Supporting neutral surfaces | Secondary background and hover fallback |
| `muted` | `#6b6b6b` | Not a single canonical source token; inferred from gray usage | Accessible secondary text |

Rules:

- Blue is structural, not decorative: it defines links, borders, focus, and primary actions.
- Yellow signals emphasis or interaction. It should remain selective so it retains impact.
- Red is reserved for errors or destructive actions.
- Default surfaces stay white; depth comes from borders, spacing, and typography rather than gradients or shadows.

## Typography

### Extracted families

- `monument-grotesk-regular`: primary body face
- `monument-grotesk-medium`: headings, navigation, and stronger labels
- `monument-grotesk-mono`: metadata, labels, and form text
- `monument-grotesk-italic`: occasional emphasis

The source site hosts these font files itself. They are not copied into this project. The implementation uses open substitutes:

- **Space Grotesk** for display and body text
- **IBM Plex Mono** for labels, metadata, and technical information

### Extracted scale and hierarchy

| Use | Reference values | App token |
| --- | --- | --- |
| Hero/display | `3.2–3.75rem`, with larger one-off display sizes | `clamp(2rem, 4vw, 3.75rem)` |
| Page title | `2.5–3rem` | `2.5rem` desktop, fluid reduction on mobile |
| Section heading | `1.5–2rem` | `1.5rem` |
| Card title | `1.3–1.5rem` | `1.125–1.25rem` |
| Body | `1–1.25rem` | `1rem` |
| Metadata | `.8–.875rem` | `.75–.875rem`, mono |

Common line heights are `1`, `1.1`, `1.2`, `1.3`, and `1.5`. Display type is compact; body text stays near `1.5` for readability. The source uses regular, medium, and occasional bold weights rather than many fine-grained weights.

## Spacing and layout

- Main content width: `1280px` maximum.
- Standard horizontal page gutter: `25px`.
- Common component padding: `.5rem`, `1rem`, `1.2rem`, `1.5rem`, and `2rem`.
- Major vertical section spacing: `2rem`, `3rem`, and `4rem`.
- Grid foundation: Bootstrap-style rows and columns, including two-column and three-column listing patterns.
- The reference frequently uses full-width graphic bands inside a constrained outer page frame.

### Responsive breakpoints

Reliable recurring breakpoints include:

- `576px`: small/mobile changes
- `768px`: tablet and stacked content
- `992px`: desktop navigation and multi-column layouts
- `1200–1240px`: large-layout limits

Additional one-off breakpoints exist in the legacy theme. This application keeps its existing responsive behavior while aligning primary changes to `640px`, `768px`, and `1024px`, the closest Tailwind equivalents.

## Shape, borders, and depth

- Primary rules and component outlines: `1px` or `2px solid #0000ff`.
- Cards and dropdowns: predominantly square corners (`0`).
- Buttons and calls to action: outlined pills using approximately `30px` or `50px` radius.
- Circular shapes are used for compact icons and status markers.
- Shadows are rare. The custom theme primarily uses `none`; Bootstrap focus rings account for most extracted shadow declarations.
- This app removes decorative shadows and uses blue borders plus color changes for hierarchy.

## Component patterns

### Navigation

- White fixed header with large blue identity type.
- Desktop links are blue, separated visually with slash-like rhythm.
- Hover and active links shift toward black.
- Mobile navigation becomes a full-screen blue surface with large white type.

### Links

- Default: blue.
- Hover: black, frequently with underline removed.
- Inverse links: white on blue, turning blue on a light surface when appropriate.

### Buttons and calls to action

- Transparent or white background, `2px` blue border, blue label, pill shape.
- Hover: blue fill, white label, and a slight upward translation.
- Large calls to action use more generous padding and an arrow treatment.
- Focus must remain visibly stronger than hover.

### Form controls

- White or transparent surface with `1–2px` blue border.
- Mono text is used in several source forms.
- Fields are generous in height; the source uses up to `80px` for large inputs and `50px` for newsletter fields.
- Invalid/error fields use yellow fill with red supporting text.

### Cards and listings

- Square white card with `1px` blue border.
- Titles use black or blue grotesk type.
- Metadata is mono.
- Hover changes the surface to yellow and moves the card upward by approximately `.25rem`.
- Dense lists often use only a blue bottom rule instead of a filled card.

### Tabs and stage indicators

Tabs are inferred for this app from link and listing behavior because the reference site does not expose an equivalent tab system on the analyzed page.

- Use blue rules and mono labels.
- Active state uses yellow fill with black text.
- Inactive state remains white with blue text.
- Avoid soft gray capsule tabs except for compact status indicators.

### Panels and modals

These are app-specific translations.

- Panels use white backgrounds, square corners, and blue outlines.
- Panel headers use white or yellow with a blue bottom rule.
- Modal overlays stay dark; modal containers use a strong blue outline and no decorative shadow.
- Dense technical diagrams may use black or blue inverse sections while preserving the same yellow/blue signal system.

## Interaction and motion

Extracted transitions range from `200ms` control changes to `1s` card and image treatments.

- Controls: `160–200ms ease` for color, border, and background.
- Cards: `300–400ms ease` in this translation; the source's `1s` is shortened for a more responsive application interface.
- Hover lift: `translateY(-0.25rem)`.
- Focus: visible blue outline with a white offset so it works on both light and blue surfaces.
- Reduced motion: remove transforms and transitions when `prefers-reduced-motion: reduce` is active.

## Application mapping

- Header: large blue wordmark treatment, square yellow mark, mono stage readout, outlined navigation controls.
- Chat: white assistant messages with blue outlines; blue user messages with white text; yellow current-stage markers.
- Letter canvas: paper-white document with blue rule, mono metadata, yellow emphasis blocks, and blue action controls.
- Scenario and saved-letter cards: square border, yellow hover, slight lift.
- Modals: blue structural rules and editorial tabs; no soft shadows or frosted-glass styling.
- System diagram: existing information remains intact, translated to blue/yellow/black/white semantic colors.

## Reliability and limitations

- Colors, font declarations, CSS dimensions, breakpoints, borders, and state rules are directly extracted and highly reliable.
- DOM patterns are reliable for the analyzed live homepage; other site templates may contain additional variants.
- The source theme contains legacy and overlapping media-query rules. This document records recurring rules rather than treating every override as intentional system guidance.
- Exact font metrics cannot be reproduced without the source's hosted Monument Grotesk files. Open substitutes intentionally avoid copying those assets.
- Image duotone filters are a prominent reference-site feature, but this application has no comparable photographic content. They are documented but not fabricated.
- Tabs, chat messages, editable documents, and AI-state indicators do not have direct equivalents on the source site; their treatments are inferred from the extracted link, form, card, and navigation rules.
