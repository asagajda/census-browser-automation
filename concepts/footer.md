---
type: Section
title: Footer
description: Page footer with external policy links (Accessibility, FOIA, Privacy, Commerce, Release Notes).
tags: [footer, external-links]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Footer

Part of the [State Profile page](../page.md). A single row of caption links at the bottom of the profile content. Root selector `.PageFooter`.

## Method Notes
- `getFooter(): Locator` — root.
- `getFooterLinks(): Promise<{text, href}[]>` — all six links.
- `clickFooterLink(name)` — partial-text match; throws pointing at `getFooterLinks()` on miss.

## Natural Language → Methods
- "open the privacy policy" → `clickFooterLink("Privacy")`
- "list footer links" → `getFooterLinks()`

## Gotchas
- **ALL LINKS ARE EXTERNAL**: every footer href leaves data.census.gov (census.gov, commerce.gov, www2.census.gov PDF). Clicking strands you outside this PO's url_pattern.
