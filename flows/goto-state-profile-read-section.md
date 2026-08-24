---
type: Flow
title: Direct goto to a state profile and read a section's stats
description: 'Open /profile/<State>?g=... directly via page.goto, wait for the PO to be ready, then read stats from a topic section — includes the failure mode when readiness is not awaited.'
tags: [navigation, goto, sections, population, retry]
timestamp: 2026-05-19T00:00:00Z
---

# Direct goto to a state profile and read a section's stats

Applies to: [State Profile page](../page.md). Drives [Profile Sections](../concepts/profile-sections.md) and depends on the lazy-load behavior documented there. Complements [navigate-to-state-profile](navigate-to-state-profile.md), which covers in-page navigation (neighbor links / search) instead of direct URL goto.

Open a state profile by URL and read a section's stats (e.g. Population).

## Params

- **state** (string, required) — State name as used in the URL slug, e.g. `Alabama`
- **fips** (string, required) — 2-digit state FIPS, e.g. `01`
- **sectionPattern** (RegExp, optional, default: `/populat/i`) — pattern to match the section name

## Steps

1. Goto the profile URL and wait for readiness via the PO (preferred — `gotoProfile` handles both):
   ```js
   // Preferred: one call — goto + networkidle (best-effort) + readiness assert.
   const state = await po.gotoProfile("https://data.census.gov/profile/Alabama?g=040XX00US01");
   // → "Alabama"; throws an actionable error if the SPA never renders.

   // Equivalent manual form:
   // await po.page.goto(url);
   // await po.page.waitForLoadState("networkidle").catch(() => {});
   // await po.waitForReady(); // asserts the state-name H1 + section shells
   ```

2. Force lazy-load of all sections, then read stats by fuzzy section name (matching is case-insensitive exact-or-substring, so a partial name works):
   ```js
   await po.waitForSections(); // asserts readiness first, then scrolls all sections into view
   const stats = await po.getSectionStats("Population"); // fuzzy-matches "Populations and People"
   return JSON.stringify({ state, stats }, null, 1);
   // Need the resolved name? const [popName] = (await po.getSectionNames()).filter(n => /populat/i.test(n));
   ```

## Gotchas

- **GOTO_NOT_READY (now guarded)**: previously `waitForSections()`/`getSectionNames()` right after `page.goto` silently returned empty results. `waitForReady()` (called inside `waitForSections()` and `gotoProfile()`) now polls up to 15s for the state-name H1 + section shells and throws with the last observation and retry advice — an empty page can no longer masquerade as "no sections". Prefer `gotoProfile(url)` over raw `page.goto`.
- **FUZZY_NAME_MATCH**: `getSectionStats("Population")` matches "Populations and People" (case-insensitive exact-or-substring); same for all section/subtopic/chart-title accessors. Exact matches win over substring matches. A true miss still throws, listing available names.
- **EMPTY_NAMES_WITH_WARNING**: if `validate()` still fails after `waitForReady()` timed out, the URL is probably not a `/profile/<State>` page — don't retry forever.
- **INTERFACE DRIFT — `gotoProfile` may be absent from the runtime PO (observed 2026-05-20, run-1787331070358)**: `po.gotoProfile is not a function` — the KB and this flow document it, but the running `CensusPagePO` did not expose it. Do NOT trust the method map blindly; probe before use and fall back to the manual form:
  ```js
  const hasGoto = typeof po.gotoProfile === "function";
  if (hasGoto) { await po.gotoProfile(url); }
  else {
    await po.page.goto(url);
    await po.page.waitForLoadState("networkidle").catch(() => {});
    await po.waitForReady();
  }
  ```
- **MULTI-TAB VALIDATE FAILURE**: same session, `validate()` failed on tab 2 with `stateName (count=0)` — the PO instance was bound to a tab whose DOM never rendered the profile (empty/unloaded tab). Before validating on a non-primary tab, confirm the tab actually navigated to a `/profile/<State>?g=...` URL; otherwise switch tabs or re-goto.

## See Also

- [navigate-to-state-profile](navigate-to-state-profile.md) — in-page alternatives (neighbor links, search) that avoid the goto readiness problem entirely.
- [read-featured-stats](read-featured-stats.md) — reading featured stats once sections are loaded.

## Knowledge

- Failure observed live (2026-05-19): two consecutive attempts on the Alabama profile both failed — first on exact-name `getSectionStats("Populations and People")` (no match), then `getSectionNames()` returned `[]` with `poWarning: validate() failed — missing selector stateName (count=0)`. Root cause in both: PO not ready after direct goto. FIXED in this revision: `gotoProfile()` + `waitForReady()` + fuzzy name matching remove both failure modes. Re-verified live on the Alabama profile (state-independent selectors).
- Interface drift observed live (2026-05-20, run-1787331070358): session failed with `po.gotoProfile is not a function` plus `validate()` failure (`stateName count=0`) on tab 2 — the runtime PO was missing `gotoProfile` despite it being documented here. Recovery: feature-probe `gotoProfile` and use the manual `page.goto` + `waitForReady()` form; verify tab URL before validating.

## Source

Converted from po-agent trace `run-1787330585704` (failed session — captured for the failure mode and recovery recipe). Updated from trace `run-1787331070358` (interface-drift failure: `gotoProfile` missing from runtime PO; validate() failed on tab 2).
Last validated: 2026-05-19 (gotoProfile path); drift observed 2026-05-20
