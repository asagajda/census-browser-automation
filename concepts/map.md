---
type: Section
title: Map
description: MapLibre state map canvas with zoom controls.
tags: [map, maplibre, zoom]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Map

Part of the [State Profile page](../page.md). A MapLibre GL canvas showing the state geometry, top-left of the profile content. Root selector `#map-section`.

## Method Notes
- `getMap(): Locator` — the interactive map container (`#map-section`; a second static instance `#profile-map`/`#map-header` exists — see gotcha).
- `zoomInMap()` / `zoomOutMap()` — `button.maplibregl-ctrl-zoom-in` / `-zoom-out`.

## Natural Language → Methods
- "zoom in on the map" → `zoomInMap()`

## Gotchas
- **TWO MAP INSTANCES**: `#map-header` (static, no controls) and `#map-section` (interactive, has zoom controls). The zoom buttons exist only on the second — the live count of `maplibregl-ctrl-zoom-in` is 1.
- The map is a `<canvas>` — nothing inside it is DOM-selectable. A `.MapPopups` container exists for click-popups but is empty until a map feature is clicked at coordinates (not exposed by this PO).
