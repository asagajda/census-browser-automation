---
type: Section
title: Searchbar
description: The "Search for an area, a topic, or both" combobox with a suggestion dropdown, clear button, and search submit.
tags: [search, combobox, suggestions]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Searchbar

Part of the [App Header](header.md) on the [State Profile page](../page.md). A combobox that suggests geographies, topics, and profiles as you type. Root selector `.searchbar-wrapper` (the FIRST one — see gotcha).

## Method Notes
- `getSearchInput(): Locator` — `.searchbar-wrapper input[type="text"]`.
- `search(query)` — clicks + fills; does NOT submit. Suggestions fetch after ~1s.
- `getSearchSuggestions(): Promise<string[]>` — dropdown texts (`.aqua-searchbar_dropdown` items), e.g. `"Texas"`, `"Harris County, Texas"`, `"Texas ProfileTexas has a land area of ..."`, `"Explore Filters..."`.
- `clickSearchSuggestion(name)` — partial case-insensitive match; clicking navigates (e.g. a "… Profile" item goes to that profile page).
- `clearSearch()` — clicks the Clear Text button (`.clear-button-container`); no-op if empty.
- `submitSearch()` — clicks `.search-button`; navigates to search results.

## Natural Language → Methods
- "search for Texas" → `search("Texas")` then `getSearchSuggestions()`
- "open the Texas profile" → `search("Texas")` + `clickSearchSuggestion("Texas Profile")`
- "clear the search box" → `clearSearch()`

## State Fields
- `searchQuery: string` — current input value. Derived in `gatherState()`.

## Gotchas
- **DUPLICATED SEARCHBAR**: the searchbar markup exists TWICE (`header.AppHeader .searchbar-wrapper` and a `.search-bar` landing variant below it). Always scope to `.searchbar-wrapper` and use `.first()`.
- The input carries `role="combobox"`; the visible placeholder text ("Search for an area, a topic, or both") is a sibling label div, not the input's label — select by `input[type="text"]` within the wrapper.
- Suggestion items include a trailing `"Explore Filters..."` menu option — filter it out if you only want result suggestions.
