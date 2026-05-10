---
name: Agencia Byte
description: Engineering agency for companies in a hurry. Custom software, AI automation, systems integration.
colors:
  live-signal: "#FF6A1A"
  live-signal-soft: "#FFE7D6"
  live-signal-ink: "#1A0A00"
  technical-ivory: "#FAFAF7"
  elevated-surface: "#FFFFFF"
  ink-primary: "#0B1020"
  ink-secondary: "#2A2F45"
  ink-dim: "#5B6175"
  system-dark: "#0B1020"
  system-deep: "#0F1530"
  system-elevated: "#131A36"
  system-ivory: "#F4F4ED"
  system-muted: "#B7BCD0"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(56px, 7.5vw, 104px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "14px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "80px"
  section: "110px"
components:
  button-primary:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.technical-ivory}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.ink-secondary}"
    textColor: "{colors.technical-ivory}"
  button-accent:
    backgroundColor: "{colors.live-signal}"
    textColor: "{colors.live-signal-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "inherit"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  chip:
    backgroundColor: "{colors.elevated-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.elevated-surface}"
    rounded: "{rounded.md}"
    padding: "28px"
  card-dark:
    backgroundColor: "rgba(255,255,255,0.025)"
    rounded: "{rounded.md}"
    padding: "32px"
  input:
    backgroundColor: "{colors.technical-ivory}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# Design System: Agencia Byte

## 1. Overview

**Creative North Star: "The Precision Instrument"**

Every margin is load-bearing. Every color earns its place. The Agencia Byte design system does not decorate — it specifies. Like reading a well-written API spec that happens to be beautiful: no superfluous words, no flourish for its own sake, every element doing exactly its assigned job.

The visual language is built on three structural moves: tight display typography (-0.02em tracking, 0.98 line-height) that reads as engineered rather than styled; a strict orange signal that activates only on live, interactive, or actionable states — never decorative; and a light/dark section alternation that creates structural rhythm without requiring graphical complexity. The dark sections are not mood boards. They are command surfaces.

This system explicitly rejects: SaaS genérico patterns (purple gradients, hero metric grids, "10x your growth" copy templates), cheap outsourcing aesthetics (stock photography, generic icons, dense text walls), and creative agency maximalism (image-led layouts where the site is the product). Agencia Byte builds systems — the demos, terminals, and pipeline animations are the visual content.

**Key Characteristics:**
- Tight typographic control — display headings near line-height 1, heavy negative tracking
- Structural dark/light alternation as the primary depth strategy
- Mono type as a technical annotation layer, not decoration
- Orange reserved for live signals and primary actions only
- Gridded backdrops as ambient texture, never focal points
- Interaction feedback through translateY lift, not color flood

## 2. Colors: The Live Signal Palette

One signal color, two surface registers, and a complete tonal system for text. Every token either carries information or recedes.

### Primary

- **Live Signal Orange** (`#FF6A1A`): The sole accent. Used on primary CTAs, active pipeline nodes, the eyebrow dot indicator, animated status pulses, and the SVG underline on hero headlines. When this color appears, something is live, active, or requires action.
- **Live Signal Soft** (`#FFE7D6`): The tint wash. Used for focus rings, budget-selector active state backgrounds, and hover backgrounds on accent-adjacent elements. Never used on text.
- **Live Signal Ink** (`#1A0A00`): Near-black for text placed directly on the orange accent (e.g., the accent button label). Ensures AAA contrast on the signal color.

### Neutral (Light register)

- **Technical Ivory** (`#FAFAF7`): The page background. A warm off-white with a trace of yellow-green — not pure white, never clinical. The warmth is intentional; it reads as a physical surface, not a screen default.
- **Elevated Surface** (`#FFFFFF`): Cards, form backgrounds, and layered containers. The slight step up from Technical Ivory communicates hierarchy without shadows.
- **Ink Primary** (`#0B1020`): Primary text and the default button background. Deep navy-black with a blue undertone — not neutral grey, not pure black. The blue in the darkness is the same hue family as the dark sections, keeping the system coherent.
- **Ink Secondary** (`#2A2F45`): Secondary headings, strong body emphasis.
- **Ink Dim** (`#5B6175`): Muted text, metadata, supporting copy. Also used as the border color at 10% and 18% opacity for `--line` and `--line-strong`.

### Neutral (Dark register)

- **System Dark** (`#0B1020`): Primary dark section background. Used for the Demo section, code terminals, and the footer. The same value as Ink Primary creates a visual system where dark text on light and dark backgrounds share a hue.
- **System Deep** (`#0F1530`): Secondary dark layer, slightly bluer. Used as a deeper background tier in code editors and dark hero surfaces.
- **System Elevated** (`#131A36`): Elevated dark surface — card backgrounds within dark sections. The three-step dark stack (Dark → Deep → Elevated) mirrors the light stack (Ivory → Elevated Surface).
- **System Ivory** (`#F4F4ED`): Primary text on dark surfaces. Slightly warm, not pure white.
- **System Muted** (`#B7BCD0`): Secondary and muted text on dark. Used for supporting copy, metadata, and eyebrow text in dark sections.

### Named Rules

**The Rarity Rule.** Live Signal Orange (`#FF6A1A`) covers at most 10–15% of any given screen. A CTA, a status dot, an active node — that is its full budget. A screen where orange appears on a card icon, a list bullet, a badge, a headline, AND a button has broken the rule. Choose one per screen.

**The No-Pure-Black Rule.** Neither `#000000` nor `#FFFFFF` appear in this system. Every neutral is tinted toward the deep navy hue family. Pure white or black reads as system default; the tinted versions read as designed.

**The Signal Rule.** Orange marks only live, active, or actionable states. It is never used as a decorative accent, a background pattern, or a divider color. If it appears, it must mean something.

## 3. Typography: Controlled Precision

**Display Font:** Space Grotesk (700 weight, fallback: ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist (300–600 weight range, fallback: ui-sans-serif, system-ui, sans-serif)
**Technical Font:** JetBrains Mono (400–600 weight, fallback: ui-monospace, SFMono-Regular, monospace)

**Character:** Space Grotesk at 700 with -0.02em tracking and 0.98 line-height is the entire brand voice in typographic form: dense, confident, and slightly compressed — engineered rather than designed. Geist body is clean and neutral enough to step back. JetBrains Mono functions as a technical annotation layer, never decorative: it signals "this came from a system."

### Hierarchy

- **Display** (700, `clamp(56px, 7.5vw, 104px)`, line-height 0.98, tracking -0.02em): Hero headlines only. The tight line-height means multi-line headlines collapse into a single mass. This is intentional — it reads as a declaration, not a paragraph.
- **Headline** (700, `clamp(40px, 5vw, 64px)`, line-height 1.05, tracking -0.02em): Section headings (Sobre, Serviços, Demo, etc.). Same Space Grotesk personality, scaled down.
- **Title** (600, 18–24px, line-height 1.4): Card headings, service titles, named items within sections. Uses Geist at 600 weight with `font-family: var(--font-display)` (Space Grotesk).
- **Body** (400, 16px, line-height 1.55): All paragraph copy. Max width 520–640px for comfortable reading. Geist Regular.
- **Label/Mono** (400–600, 11–13.5px, tracking 0.04–0.1em, uppercase): Eyebrow text, KPI units, code annotations, system metadata, form field labels. Always JetBrains Mono. Always uppercase when used as an eyebrow. The 11.5px eyebrow at 0.1em tracking is a system-standard — do not deviate.

### Named Rules

**The Mono Thread Rule.** JetBrains Mono is the annotation layer. It appears at eyebrow scale (11–13px), never at headline scale. If you reach for Mono to headline something, you are using the wrong font — Space Grotesk at 700 is the headline voice.

**The Compression Rule.** Display and Headline typography uses 0.98 and 1.05 line-heights respectively. Do not round up to 1.2 "for readability." The compression is the statement.

## 4. Elevation

This system uses tonal layering as the primary depth mechanism. The light register has two background tiers (Technical Ivory → Elevated Surface) and the dark register has three (System Dark → System Deep → System Elevated). These differences are subtle by design — they communicate containment and hierarchy without shadows.

Shadows appear in two contexts only: (1) hover state on interactive cards, encoding interactivity, not rest state; (2) structural decorative use in terminal/code widgets where deep shadows convey the physical weight of an embedded system view. No ambient shadows on content cards at rest.

### Shadow Vocabulary

- **Hover Lift** (`0 16px 40px -20px rgba(11,16,32,0.18)`): Applied to `.card:hover`. Directional, with a large spread and negative offset — creates a clean lift without a diffuse glow. Used on all interactive cards.
- **System Widget** (`0 30px 60px -20px rgba(11,16,32,0.35), 0 8px 24px -12px rgba(11,16,32,0.25)`): Terminal and code editor panels. Heavier, two-layer shadow that grounds the dark widget against a lighter background. Signals "this is a running system."
- **Active Glow** (`0 0 0 6px rgba(accent,0.13), 0 0 24px rgba(accent,0.4)`): Pipeline node active state. Used only in the live demo animation. Never on static elements.

### Named Rules

**The Flat-at-Rest Rule.** No card, panel, or container has a box-shadow at rest. Shadows encode state (hover, active, elevated widget). A static shadow is a decoration; this system does not decorate.

## 5. Components

### Buttons

Three variants, each with a distinct purpose hierarchy.

- **Shape:** Gently rounded (8px radius) — approachable but not soft, not sharp. Radius 8px in exact terms (`--radius-sm`).
- **Primary (dark):** Background `#0B1020`, text `#FAFAF7`. 600 weight, 14px Geist. Padding `10px 18px`. Hover: `translateY(-1px)`. Used for secondary CTAs after the accent has been established.
- **Accent (orange):** Background `#FF6A1A`, text `#1A0A00`. Same shape and padding. This is the primary action button — "Começar um projeto", "Enviar". One per primary section.
- **Ghost:** Background transparent, `1px solid rgba(11,16,32,0.18)` border, inherits text color. For secondary actions alongside an accent button ("Ver demo ao vivo").
- **Hover / Focus:** `translateY(-1px)` on all variants. Focus: `outline: 2px solid var(--accent); outline-offset: 3px` — visible and high-contrast for AAA compliance.

### Chips

Used for status badges and version indicators.

- **Style:** `background: var(--bg-elev)`, `border: 1px solid var(--line)`, `border-radius: 999px`, JetBrains Mono 12px at 0.04em tracking. Padding `6px 12px`.
- **Live indicator:** An animated pulse dot (7px circle, orange, with expanding ring animation `pulse 1.6s ease-out infinite`) precedes the label text. Signals "this is live, not static." Reserved for actual live status — not used decoratively.
- **Dark variant:** `background: rgba(255,255,255,0.04)`, `border-color: rgba(255,255,255,0.12)`.

### Cards / Containers

- **Corner Style:** Generously rounded (14px — `--radius`). Inside dark sections, dark-variant cards use the same radius but with `rgba(255,255,255,0.025)` background.
- **Background:** Elevated Surface (`#FFFFFF`) on light sections. Dark variant: `rgba(255,255,255,0.025)` — nearly transparent over System Dark, creating a subtle tonal step.
- **Shadow:** None at rest. Hover Lift shadow on interactive cards.
- **Border:** `1px solid rgba(11,16,32,0.10)` on light; `1px solid rgba(255,255,255,0.10)` on dark.
- **Internal Padding:** 28px default; 32px for prominent feature cards; 22–24px for compact grid cards.
- **Hover:** `translateY(-2px)`, border tightens to `rgba(11,16,32,0.18)`, Hover Lift shadow appears. Transition: `0.25s ease` on transform, box-shadow, and border-color.

### Inputs / Fields

- **Style:** `background: var(--bg)` (Technical Ivory), `border: 1px solid var(--line-strong)`, `border-radius: 10px`, Geist 15px. Full width by default.
- **Focus:** `border-color: var(--accent)`, `box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent)`. The focus ring uses the signal orange — interactive state, not decoration.
- **Dark mode:** `background: var(--dark-bg-2)`, `border-color: var(--dark-line)`. Same focus treatment.
- **Labels:** JetBrains Mono, 11px, 0.06em tracking, uppercase, `var(--ink-3)` color. Form labels are metadata, not UI copy.

### Navigation

- **Style:** Sticky, `backdrop-filter: blur(14px) saturate(140%)` with a translucent background (78% opacity). Bottom border `1px solid var(--line)`. The blur is functional: it distinguishes the nav from scrolling content — not a glassmorphism aesthetic statement.
- **Links:** Geist 14px, `opacity: 0.8` default, `opacity: 1` on hover. Underline link animation on hover (`::after` pseudo-element scales in from left).
- **Brand mark:** Space Grotesk 600, with a 32px logo mark and a live-signal orange dot indicator in the top-right corner (`8px circle, box-shadow: 0 0 0 3px var(--bg)`).
- **Mobile:** Nav links hidden below 880px. CTA and theme toggle remain visible.

### Terminal / Code Editor (Signature Component)

The terminal and code editor widgets are the system's most distinctive visual elements. They ground the engineering narrative in running, observable software.

- **Terminal:** Dark chrome (`#0B1020` background), macOS-style traffic lights (red `#FF5F57`, yellow `#FEBC2E`, green `#28C840`), JetBrains Mono 13.5px, line-height 1.6. Syntax colors are drawn from the system palette: prompt in teal (`#5DD3A8`), accent values in Live Signal Orange, strings in gold-amber (`#FFD79A`), keywords in muted blue (`#8AB4F8`). System Widget shadow.
- **Code editor:** Same dark chrome with tab bar. Line numbers in a guttered column. Syntax uses the same color palette as the terminal.
- **Purpose:** These widgets are the demonstrations, not illustrations. They animate live state. Do not replace with screenshots or static images.

## 6. Do's and Don'ts

### Do:

- **Do** use Live Signal Orange only on CTAs, active pipeline nodes, animated status indicators, and the eyebrow dot. One instance of the accent per primary section is the target.
- **Do** set display headlines with `letter-spacing: -0.02em` and `line-height: 0.98`. The compression is not a mistake — it is the typographic voice.
- **Do** use JetBrains Mono for all system metadata: version numbers, code comments, metric units, form field labels, eyebrow text. It annotates; it does not headline.
- **Do** alternate light and dark sections as the primary depth and rhythm mechanism. The dark sections (Demo, Footer) are structural beats, not mood choices.
- **Do** add `prefers-reduced-motion` media queries to all animations: the terminal typewriter, the pipeline pulse, the reveal transitions.
- **Do** ensure all text meets WCAG AAA contrast: 7:1 for normal text on its background, 4.5:1 for large text.
- **Do** place `focus-visible` outlines on all interactive elements using the orange accent at 2px, 3px offset.

### Don't:

- **Don't** use purple gradients, hero metric grids, or copy patterns like "10x your growth" — this is SaaS genérico, the primary anti-reference for this system. It erases engineering credibility.
- **Don't** use stock photography or image-heavy layouts. The terminal animations, the live pipeline demo, and the clients section are the visual content.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Use solid colors. Emphasis through weight and size only.
- **Don't** use `border-left` greater than 1px as a colored stripe on cards, callouts, or list items. Rewrite with full borders, background tints, leading numbers (like the `01`, `02` service codes), or nothing.
- **Don't** center-align body paragraphs. Engineering copy reads left-aligned.
- **Don't** apply glassmorphism patterns beyond the nav. The nav blur is functional — it layers a fixed element over scrolling content. Extending blur/glass to cards or modals is decorative glassmorphism.
- **Don't** add identical card grids with icon + heading + text repeated without variation. When cards are the right affordance, vary their internal content structure (the Services section uses numbered codes and bullet lists, not generic icon rows).
- **Don't** use orange as a background color on large surfaces. It works at button scale and dot scale — at section or card scale it overwhelms the rarity budget.
- **Don't** create walls of dense text with no typographic hierarchy. The "outsourcing barato" anti-pattern is the most common mistake for engineering agencies — break copy with eyebrows, spacing, and mono annotations.
