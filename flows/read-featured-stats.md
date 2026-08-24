---
type: Flow
title: Read featured stats for a topic section
description: Force lazy-load of a section and read its featured estimates (state vs US) with margins of error.
tags: [stats, lazy-loading, flow]
timestamp: 2025-01-20T00:00:00Z
---

# Read featured stats for a topic section

Applies to: [State Profile page](../page.md). Uses [Profile Sections](../concepts/profile-sections.md).

## Proven recipe

```js
await po.gatherState();            // before: loadedSectionCount likely 1
await po.jumpToSection("Education"); // scroll + trigger lazy load
await po.page.waitForTimeout(1500);  // XHR fetch + render of section content
await po.getSectionStats("Education");
// [{value: "36.0%", moe: "± 1.0%", description: "Bachelor's Degree or Higher in Kansas"},
//  {value: "34.9%", moe: "± 0.2%", description: "Bachelor's Degree or Higher in United States"}]
await po.gatherState();            // after: loadedSectionCount increased
```

To read EVERY section: `await po.waitForSections()` first (scrolls the whole page), then `getSectionNames()` + `getSectionStats(name)` per section. For one subtopic only (e.g. just Health Insurance within Health): `getSubtopicStats("Health", "Health Insurance")`.

Gotcha: without the scroll/wait, later sections still contain `.LoadingScreen` placeholders and stats read as empty — see LAZY_SECTIONS in [Profile Sections](../concepts/profile-sections.md).

## Name matching: fuzzy, exact-or-substring (FLOW_EXACT)

`getSectionStats(name)` resolves section names via `_matchName` —
**case-insensitive exact match first, then substring containment**. Calling it
with a partial name (e.g. `"Population"` for the section titled
`"Populations and People"`) matches on substring and works directly:

```js
await po.waitForSections();
const stats = await po.getSectionStats("Population");   // matches "Populations and People"
```

On a miss it throws a rich error listing all available section names. The same
matcher backs `getSubtopics`, `getSectionSourceLinks`, and the by-title chart
accessors (`showChartTableByTitle` / `setChartMoeByTitle` /
`openChartShareEmbedByTitle`).

Section names are the same 10 across states (Populations and People, Income and
Poverty, Education, Employment, Housing, Health, Business and Economy, Families
and Living Arrangements, Race and Ethnicity, Nearby States).

State-vs-US pairing: each featured stat appears twice — `"... in <State>"` then
`"... in United States"` — so stats come back as alternating state/US pairs with
MoE on each. Verified on Alabama (Median Age 39.6 AL vs 39.2 US; Foreign-Born
4.5% AL vs 14.8% US).

## See Also

- [goto-state-profile-read-section](goto-state-profile-read-section.md) — how to arrive at the profile URL first.
- [show-chart-table](show-chart-table.md) — drill into the chart behind these stats.

Last validated: 2026-08-19 (Alabama: waitForSections + exact-name resolve + state-vs-US stats). Previously validated 2025-01-20.
