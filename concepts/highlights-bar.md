---
type: Section
title: Highlights / Jump-Links Bar
description: Sticky glass bar with breadcrumbs, the Display Sources toggle, key stat cards, and section jump buttons.
tags: [highlights, toggle, breadcrumbs, navigation]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Highlights / Jump-Links Bar

Part of the [State Profile page](../page.md). The `aqua-glass` bar carrying: `// United States / <State>` breadcrumbs, the **Display Sources** switch, one key-stat card per topic section (Total Population, Median Household Income, …), and a row of section jump buttons. Root selector `.ProfileHighlights.main-highlights`.

## Method Notes
- `getHighlightsBar(): Locator` — root.
- `getUsBreadcrumbLink(): Locator` — `a` to `/profile/United_States?g=010XX00US`.
- `isSourceToggleOn(): Promise<boolean>` — reads `aria-checked` on `.AquaToggle.source-toggle`.
- `setDisplaySources(on)` — toggles; no-op when already in state. Clicks the inner `.wrapper` (see gotcha).
- `getSectionJumpButtons(): Locator` — `button[aria-label$=" section"]` (e.g. aria-label "Education section").
- `jumpToSection(name)` — clicks the matching jump button; scrolls to and triggers lazy-load of that [Profile Section](profile-sections.md).
- `getHighlights(): Promise<{label, value}[]>` — the key stat cards (`.highlight-label` / `.highlight-value`).

## Natural Language → Methods
- "turn off source citations" → `setDisplaySources(false)`
- "jump to Housing" / "scroll to the Health section" → `jumpToSection("Housing")`
- "what's the total population?" → `getHighlights()` (find label "Total Population")
- "go to the United States profile" → `getUsBreadcrumbLink().click()`

## State Fields
- `sourceToggleOn: boolean` — Derived in `gatherState()`.
- `highlights: {label, value}[]` — Derived in `gatherState()`.

## Gotchas
- **SOURCE_TOGGLE_CLICK_TARGET**: clicking the `.AquaToggle.source-toggle` root or its `.slider` does NOTHING (verified live — `aria-checked` stays put). Only a click on the inner `.wrapper` child toggles it. `setDisplaySources` encodes this.
- **DUPLICATED HIGHLIGHTS BAR**: the whole bar renders twice — `.ProfileHighlights.main-highlights` (top) and `.ProfileHighlights.section-jump-links` (sticky, appears on scroll), each with its own source toggle and identical ids (`measure-section-*` appear in both). Always scope to `.main-highlights` and `.first()`; duplicate ids mean `#measure-section-...` matches 2 elements.
- The visible card text (`highlight-label`, `highlight-value`) is `aria-hidden`; the a11y name lives in a `.aqua-screenreader-only` sibling ("The Total Population for Kansas is 2,937,880"). DOM reads are fine; a11y-tree reads should use the screenreader text.
