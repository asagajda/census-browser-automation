---
type: Flow
title: Show a chart's data table
description: Open the inline ag-grid table behind a chart and close it.
tags: [chart, table, flow]
timestamp: 2025-01-20T00:00:00Z
---

# Show a chart's data table

Applies to: [State Profile page](../page.md). Uses [Profile Sections](../concepts/profile-sections.md).

## Proven recipe

```js
await po.waitForSections();                // lazy-load all sections (scrolls through)
// Preferred: by chart title — no index arithmetic
await po.showChartTableByTitle("Housing Value");
const data = await po.getTablePopupData();
// { title: "Housing Value", headers: ["Measure","Value"],
//   rows: [["Less than $50,000","7.5%"], ...] }
await po.closeTablePopup();
```

Legacy index-based recipe:

```js
await po.jumpToSection("Populations and People");
await po.page.waitForTimeout(1500);     // section lazy-load
await po.getSectionChartTitles("Populations and People"); // orient: chart 0 = pyramid (NO table btn)
await po.showChartTable(0);             // first chart that HAS a Show Table button
await po.page.waitForTimeout(800);      // ag-grid render
await po.gatherState();                 // tablePopupOpen: true
await po.closeTablePopup();             // .close-popover inside .preview-table-popup
```

Verified live: clicking `.chart-table-button` opens a `.preview-table-popup` aqua-card containing a `SimpleDataTable` (ag-grid) with the chart's title + source table id (e.g. DP04); headers read from `.ag-header-cell-text`, rows from `.ag-row` → `.ag-cell`; `.close-popover` removes it.

Gotcha: Show-Table button index ≠ chart index (the population pyramid has a MoE button instead) — see SHOW_TABLE_INDEXING in [Profile Sections](../concepts/profile-sections.md).

Last validated: 2025-01-20.
