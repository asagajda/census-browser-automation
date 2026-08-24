---
type: Section
title: Profile Sections (Topics, Stats, Charts)
description: The lazily-loaded topic sections — featured stats with MoE, charts with Show Table / MoE toggle / Share-Embed.
tags: [sections, stats, charts, lazy-loading]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Profile Sections

Part of the [State Profile page](../page.md). The page body: ten topic sections (`section.section`), each with an h2 title, an anchor permalink, subtopics (h3), featured stats, and charts. Sections render progressively — see the LAZY_SECTIONS gotcha. See flows [read-featured-stats](../flows/read-featured-stats.md) and [show-chart-table](../flows/show-chart-table.md).

## Method Notes
- `getSections(): Locator` — all `section.section` elements.
- `getSectionNames(): Promise<string[]>` — h2 titles: Populations and People, Income and Poverty, Education, Employment, Housing, Health, Business and Economy, Families and Living Arrangements, Race and Ethnicity, Nearby States.
- `getLoadedSectionCount()` / `waitForSections(settleMs)` — count content-ready sections; scroll through the page to force all lazy loads.
- `getSectionLink(name)` — permalink href (`a.section-link`, `...#<slug>`; the slug also exists as `#<slug>` scrollto anchor).
- `getSubtopics(sectionName)` — h3 titles within a section (e.g. "Age and Sex", "Language Spoken at Home", "Veterans").
- `getSectionStats(sectionName)` — `.FeaturedStatEstimate` entries as `{value, moe, description}`; first entry = the state, second = United States comparison. Name matching is case-insensitive exact-or-substring (`_matchName`), so `"Population"` matches "Populations and People".
- `getSectionChartTitles(sectionName)` — h4 chart titles.
- `showChartTable(index)` — clicks the nth `button.chart-table-button`; opens an inline `.preview-table-popup` (ag-grid `SimpleDataTable`). Index is page-wide across Show-Table-enabled charts.
- `closeTablePopup()` — `.preview-table-popup .close-popover`; no-op if closed.
- `setChartMoe(index, on)` — toggles "Display Margin of Error" (`.moe-toggle-button`, click lands on inner `.wrapper` — same quirk as the sources toggle).
- `openChartShareEmbed(index)` — `button.share-embed-button` (id embeds the chart-slug, e.g. `share-embed-button_veterans-by-sex`); opens an aqua dialog, close with `closeDialog()`.

### By-title / by-subtopic accessors (preferred — index-free, state-independent)

- `showChartTableByTitle(chartTitle)` — resolves the `.TopicChartContainer` whose `h4.chart-title` fuzzy-matches (case-insensitive exact-or-substring) and clicks its Show Table button. No SHOW_TABLE_INDEXING arithmetic.
- `setChartMoeByTitle(chartTitle, on)` / `openChartShareEmbedByTitle(chartTitle)` — same resolution for the MoE toggle / Share-Embed dialog.
- `getSubtopicStats(sectionName, subtopicName)` — `.FeaturedStatEstimate` entries scoped to one `.SubTopic` block (state value first, US comparison second).
- `getSubtopicChartTitles(sectionName, subtopicName)` — h4 chart titles within one subtopic.
- `getSectionSourceLinks(sectionName)` — `a.source-field` citations as `{table, dataset, href}` (table id like "DP04", dataset name, `/table/...` deep link; duplicates possible).
- `getTablePopupData()` — reads the open `.preview-table-popup`: `{title, headers, rows}` (ag-grid; headers via `.ag-header-cell-text`, rows via `.ag-row` → `.ag-cell`).
- `getNearbyStateProfiles()` / `clickNearbyState(name)` — the "Nearby States" final section's `a.related-profile-link` cards (name links; "View Profile" links are skipped).

## Natural Language → Methods
- "what is the median age?" → `waitForSections()` + `getSectionStats("Populations and People")`
- "list the sections" → `getSectionNames()`
- "show the table behind the Veterans chart" → `showChartTableByTitle("Veterans by Sex")` + `getTablePopupData()`
- "show margin of error on the language chart" → `setChartMoeByTitle("Types of Language Spoken at Home", true)`
- "get a link to the Education section" → `getSectionLink("Education")`
- "health insurance coverage stats only" → `getSubtopicStats("Health", "Health Insurance")`
- "which census table does Housing come from?" → `getSectionSourceLinks("Housing")`
- "open the Oklahoma card at the bottom" → `clickNearbyState("Oklahoma")`

## State Fields
- `sectionCount: number` — Derived in `gatherState()`.
- `loadedSectionCount: number` — Derived in `gatherState()`.
- `tablePopupOpen: boolean` — Derived in `gatherState()`.
- `moeTogglesOnCount: number` — Derived in `gatherState()`.
- `chartCount: number` — rendered `.TopicChartContainer` count (28 on a state profile).
- `subtopicCount: number` — rendered `.SubTopic` block count.

## Section/Topic Inventory (verified live; same template for every state)
Ten sections: Populations and People (6 subtopics, 6 charts, pyramid has NO Show Table), Income and Poverty (2/2), Education (2/2), Employment (6/6), Housing (7/6), Health (3/3), Business and Economy (1 subtopic, NO charts — stats only), Families and Living Arrangements (3/3), Race and Ethnicity (9 subtopics, NO charts — 18 featured stats), Nearby States (cards only). Subtopic/chart counts can vary slightly by data availability per state — always enumerate at runtime.

## Gotchas
- **LAZY_SECTIONS**: only the first section ("Populations and People") is populated at load; the rest show `.LoadingScreen` skeleton placeholders until scrolled near. ALWAYS `waitForSections()` before reading stats from later sections — otherwise you read zeros/empty.
- **SHOW_TABLE_INDEXING**: the first chart (population pyramid) has no Show Table button (it has a `pyramid-moe-button` instead), so chart index ≠ Show-Table-button index. Verify by chart title before `showChartTable(i)`.
- Chart titles/subtitles and stat values are `aria-hidden` in the DOM (visual text) with screenreader-only duplicates — DOM textContent reads work fine.
- Chart Share/Embed button ids embed chart slugs (`share-embed-button_types-of-language-spoken-at-home`) — prefix-match, never hardcode.
- The final section "Nearby States" is a `relatedProfile finalSection` variant — same selectors apply; its cards use `a.related-profile-link` (one link per state + a "View Profile" link each).
- **SYNTHETIC_CLICKS_IGNORED**: aqua toggles (MoE, sources) ignore synthetic `element.click()` from `page.evaluate` — only trusted (Playwright `.click()`) events flip `aria-checked`. Probe with the PO methods, not raw eval clicks.
- **SKELETON_RESET**: a loaded section can transiently re-show its `.LoadingScreen` skeleton (observed on the first section after scrolling away and back); re-wait ~2s before reading.
- Business and Economy and Race and Ethnicity sections have NO charts — only featured stats; `showChartTableByTitle`/`setChartMoeByTitle` throw with a rich message there.
rtTableByTitle`/`setChartMoeByTitle` throw with a rich message there.
apply; its cards use `a.related-profile-link` (one link per state + a "View Profile" link each).
- **SYNTHETIC_CLICKS_IGNORED**: aqua toggles (MoE, sources) ignore synthetic `element.click()` from `page.evaluate` — only trusted (Playwright `.click()`) events flip `aria-checked`. Probe with the PO methods, not raw eval clicks.
- **SKELETON_RESET**: a loaded section can transiently re-show its `.LoadingScreen` skeleton (observed on the first section after scrolling away and back); re-wait ~2s before reading.
- Business and Economy and Race and Ethnicity sections have NO charts — only featured stats; `showChartTableByTitle`/`setChartMoeByTitle` throw with a rich message there.
