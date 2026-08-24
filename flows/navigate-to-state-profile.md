---
type: Flow
title: Navigate to another state's profile
description: Move from the current state profile to a bordering state, the US profile, or any state via search.
tags: [navigation, flow]
timestamp: 2025-01-20T00:00:00Z
---

# Navigate to another state's profile

Applies to: [State Profile page](../page.md). Uses [Profile Header](../concepts/profile-header.md) and [Searchbar](../concepts/searchbar.md). The same `CensusPagePO` matches every state profile (url_pattern generalizes `/profile/<State>?g=040XX00US<FIPS>`), so after navigation `po` re-validates against the new state.

## Proven recipe — bordering state

```js
await po.getNeighborStates();            // [{name: "Nebraska", href: "/profile/Nebraska?g=040XX00US31"}, ...]
await po.clickNeighborState("Nebraska"); // full navigation
await po.page.waitForLoadState('networkidle'); // SPA re-render of profile content
await po.getStateName();                 // "Nebraska"
```

## Proven recipe — arbitrary state via search

```js
await po.search("Texas");
await po.getSearchSuggestions();          // ~1s debounce; includes "Texas Profile..."
await po.clickSearchSuggestion("Texas Profile");
await po.page.waitForLoadState('networkidle');
await po.getStateName();                  // "Texas"
```

Before/after: `gatherState().stateName` changes from the old to the new state; `url` changes to the new `/profile/<State>?g=...`.

Last validated: 2025-01-20 (neighbor links + search suggestions verified live on the Kansas profile).
