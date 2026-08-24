---
type: Section
title: Gov Banner
description: The "An official website of the United States government" strip with the expandable "Here's how you know" explanation.
tags: [gov-banner, disclosure, header]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Gov Banner

Part of the [State Profile page](../page.md). The thin strip above the app header asserting the .gov/HTTPS trust model. Root selector `.gov-banner`.

## Method Notes
- `getGovBanner(): Locator` — the banner root.
- `expandHowYouKnow(): Promise<boolean>` — clicks `.menu-activator` (aria-label "Here's how you know. Press enter for more information.") to reveal `.gov-menu` (two paragraphs: "Official websites use .gov" and "Secure .gov websites use HTTPS"). Defensive no-op when already expanded.

## Natural Language → Methods
- "expand the how you know section" / "show the government site notice" → `expandHowYouKnow()`

## Gotchas
- The activator is a `div[tabindex=0]`, not a `<button>` — target `.menu-activator` by class, not tag.
