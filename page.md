---
type: PageObject
title: data.census.gov State Profile
description: Per-state demographic profile page — highlights, lazily-loaded topic sections with stats and charts, search, and cross-state navigation.
tags: [census, profile, demographics, data.census.gov]
timestamp: 2025-01-20T00:00:00Z
url_pattern: "^https://data\\.census\\.gov/profile/[^/]+\\?g=040XX00US\\d{2}(?:[#&].*)?$"
po_class: CensusPagePO
po_module: po.ts
resource: https://data.census.gov/profile/Kansas?g=040XX00US20
---

# data.census.gov State Profile

A state's demographic profile on data.census.gov. One template renders every
state: `/profile/<StateName>?g=040XX00US<FIPS>` (e.g. `/profile/Alabama?g=040XX00US01`).
This bundle — selectors, methods, flows — applies to **all** states; nothing is
Kansas-specific.

## Quick Start

```js
// po is auto-instantiated on any /profile/<State>?g=... URL
await po.validate();
const name = await po.getStateName();          // "Kansas"
await po.waitForSections();                    // force lazy-load of all 10 sections
const stats = await po.getSectionStats("Education");
// [{value: "36.0%", moe: "± 1.0%", description: "Bachelor's Degree or Higher in Kansas"}, ...]
await po.getHighlights();                      // key stat cards
```

## User Mental Model

A user lands on their state's profile: a map and a title block ("State / Kansas /
land-area description with bordering-state links"), a sticky glass bar of key
stats and section jump-links with a Display Sources toggle, then ten topic
sections (Populations and People → Nearby States) each containing subtopics,
featured state-vs-US estimates, and charts with data tables behind "Show Table".
The header offers global search (areas/topics/profiles) and result-type tabs
(All/Tables/Maps/Charts/Profiles/Pages) scoped to the current geography.

## Natural Language → Method Map

- "what state is this profile?" → `getStateName()`
- "open <State>'s profile by URL" → `gotoProfile(url)` (goto + readiness wait) — ⚠️ observed missing from runtime PO 2026-05-20; probe `typeof po.gotoProfile === "function"` and fall back to `page.goto` + `waitForReady()` (see [flow](flows/goto-state-profile-read-section.md))
- "total population / median income headline" → `getHighlights()`
- "median age in this state" → `waitForSections()` + `getSectionStats("Populations and People")`
- "list the topic sections" → `getSectionNames()`
- "jump to Housing" → `jumpToSection("Housing")`
- "hide the source citations" → `setDisplaySources(false)`
- "show margin of error on a chart" → `setChartMoe(i, true)`
- "show the table behind a chart" → `showChartTableByTitle(title)` + `getTablePopupData()` (see [flow](flows/show-chart-table.md))
- "health insurance stats only" → `waitForSections()` + `getSubtopicStats("Health", "Health Insurance")`
- "which census tables does Housing cite?" → `getSectionSourceLinks("Housing")`
- "open the nearby-state card for Oklahoma" → `clickNearbyState("Oklahoma")`
- "share / copy this profile link" → `openShareDialog()` + `copyShareUrl()` + `closeDialog()`
- "go to a bordering state" → `clickNeighborState("Nebraska")`
- "search for Texas and open its profile" → `search("Texas")` + `clickSearchSuggestion("Texas Profile")`
- "go to tables/maps for this state" → `clickNavTab("Tables")`
- "open the US profile" → `getUsBreadcrumbLink().click()`
- "zoom the map" → `zoomInMap()` / `zoomOutMap()`
- "footer link / privacy policy" → `clickFooterLink("Privacy")` (external!)

## Cross-Cutting Gotchas

- **LAZY_SECTIONS**: only the first topic section is populated at load; the
  rest are `.LoadingScreen` skeletons until scrolled near. `waitForSections()`
  before reading any later section. See [Profile Sections](concepts/profile-sections.md).
- **DUPLICATED_MARKUP**: the searchbar (×2), the highlights bar (main + sticky
  jump-links, with duplicated `measure-section-*` ids), and `#census-home-link`
  (×3) all render multiple times. Locators are scoped + `.first()`.
- **AQUA_TOGGLE_CLICK_TARGET**: aqua toggles (Display Sources, chart MoE) only
  respond to clicks on the inner `.wrapper` — root/slider clicks are silently
  ignored (verified live). PO methods encode this.
- **DIALOG_CLOSE**: aqua dialogs close ONLY via `.aqua-dialog-close-button`;
  backdrop clicks are intercepted. See [Profile Header](concepts/profile-header.md).
- **ID-EMBEDS-SLUGS**: share button and Share/Embed ids embed state/chart slugs
  (`share-button_kansas`, `share-embed-button_veterans-by-sex`) — prefix-match,
  never hardcode.
- **ARIA-HIDDEN VISIBLE TEXT**: stat values, chart titles, and highlight cards
  are `aria-hidden` with `.aqua-screenreader-only` duplicates — DOM reads are
  authoritative for this PO.
- **EXTERNAL NAVIGATION**: logo, footer links, dataset source links, and social
  share all leave data.census.gov.

## Concept Inventory

| Concept | Root selector | What it covers |
|---|---|---|
| [Gov Banner](concepts/gov-banner.md) | `.gov-banner` | "Here's how you know" disclosure |
| [App Header](concepts/header.md) | `header.AppHeader` | logo, nav tabs, Explore Filters, help links |
| [Searchbar](concepts/searchbar.md) | `.searchbar-wrapper` | combobox, suggestions, clear, submit |
| [Profile Header](concepts/profile-header.md) | `.ProfileHeader` | name, type, description, neighbors, share dialog |
| [Map](concepts/map.md) | `#map-section` | MapLibre canvas, zoom controls |
| [Highlights Bar](concepts/highlights-bar.md) | `.ProfileHighlights.main-highlights` | breadcrumbs, sources toggle, jump links, stat cards |
| [Profile Sections](concepts/profile-sections.md) | `section.section` | subtopics, featured stats, charts, Show Table, MoE |
| [Footer](concepts/footer.md) | `.PageFooter` | external policy links |

## Flows Inventory

| Flow | Recipe |
|---|---|
| `flows/goto-state-profile-read-section.md` | Direct goto to a state profile URL and read a section's stats (goto readiness + exact-name gotchas; **2026-05-20: `gotoProfile` observed missing from runtime — probe & fall back to manual goto**) — 2026-05-20 |
| [Navigate to another state's profile](flows/navigate-to-state-profile.md) | neighbor links / search suggestions |
| [Read featured stats](flows/read-featured-stats.md) | lazy-load + `getSectionStats()`; exact section-name matching required (regex-resolve via `getSectionNames()`) |
| [Share the profile](flows/share-profile.md) | dialog + copy URL + close |
| [Show a chart's data table](flows/show-chart-table.md) | `showChartTable()` + popup close |

## State System (`gatherState()`)

```
url, stateName, profileType, sourceToggleOn,
sectionCount, loadedSectionCount, highlights[{label,value}],
neighborStateCount, searchQuery, shareDialogOpen, tablePopupOpen, moeTogglesOnCount
```

## API Endpoints

None captured. The profile's data arrives via Census API XHRs not observed in
detail during authoring; `po.api.fetchJson({url})` is provided as a generic
origin-inheriting escape hatch (e.g. for api.census.gov endpoints).

## Open Questions

- The Help dropdown menu items and the Accessibility panel (`.acc-button`)
  expose surfaces not yet modeled — no methods beyond getters.
- Map feature click-popups (`.MapPopups`) require canvas-coordinate clicks; not exposed.
- The address-lookup and voice-search buttons inside the searchbar are inert
  for automation (geo/mic permissions) and intentionally unmodeled.
e clicks; not exposed.
- The address-lookup and voice-search buttons inside the searchbar are inert
  for automation (geo/mic permissions) and intentionally unmodeled.
