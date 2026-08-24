---
type: Section
title: App Header (Logo, Nav Tabs, Help Links)
description: Census logo, Explore Filters link, All/Tables/Maps/Charts/Profiles/Pages nav tabs, and Home/Apps/Help links.
tags: [header, nav, tabs]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# App Header

Part of the [State Profile page](../page.md). Persistent app chrome above the profile content. Root selector `header.AppHeader`. The search portion is documented separately in [Searchbar](searchbar.md).

## Method Notes
- `getHeader(): Locator` — root.
- `getLogoLink(): Locator` / `clickLogo()` — `a[aria-label*="census.gov home page"]`; navigates AWAY to https://www.census.gov.
- `getExploreFiltersLink(): Locator` — `a.advanced-search-button`, navigates to `/advanced?g=...` (Advanced Search keeping the current geography).
- `getNavTabs(): Locator` — the six `a.aqua-tab.header` links. Each navigates within data.census.gov preserving the `?g=` geography.
- `clickNavTab(name)` — by exact tab name (case-insensitive). Throws with the valid tab list on miss.
- `getHomeLink()` / `getAppsLink()` — `a[href="/"]` and `a[href^="/app"]` in the right-hand help-links cluster.
- `getHelpButton(): Locator` — `button.help-button`, opens the Help dropdown.

## Natural Language → Methods
- "go to tables" / "open the Maps tab" → `clickNavTab("Tables")`
- "open advanced search" / "explore filters" → `getExploreFiltersLink().click()`
- "go back to the data.census.gov home page" → `getHomeLink().click()`

## Gotchas
- **TRIPLE `#census-home-link`**: the id `census-home-link` is used on THREE different anchors (logo, home link, apps link). Never select by that id — use aria-label / href, and `.first()` where needed.
- All tab links are real `<a href>` navigations (full page loads), not SPA soft swaps — expect a fresh DOM after `clickNavTab`.
