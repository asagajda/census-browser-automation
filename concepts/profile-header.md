---
type: Section
title: Profile Header
description: State name H1, geography type, narrative description with bordering-state links, and the Share Profile button/dialog.
tags: [profile, title, share, neighbors]
timestamp: 2025-01-20T00:00:00Z
resource: po.ts
---

# Profile Header

Part of the [State Profile page](../page.md). The identity block of the profiled state. Root selector `.ProfileHeader`. See flow [share-profile](../flows/share-profile.md).

## Method Notes
- `getStateName(): Promise<string>` — `.ProfileHeader h1.AquaText` (e.g. "Kansas").
- `getProfileType(): Promise<string>` — `.profile-type` (e.g. "State").
- `getDescription(): Promise<string>` — `.header-description` (land/water area, size rank, bordering states).
- `getNeighborStateLinks(): Locator` / `getNeighborStates(): Promise<{name, href}[]>` — `a.dynamic-link` inside the description; hrefs are `/profile/<State>?g=040XX00US<FIPS>`.
- `clickNeighborState(name)` — navigates to that state's profile (same PO applies — see [page](../page.md) url_pattern).
- `getShareButton(): Locator` — `button[id^="share-button_"]`.
- `openShareDialog()` — opens the aqua dialog (`.SocialShareDialog` with X/Facebook/… `.SocialShareButton` targets and a copy-URL button `button[title="Copy url to clipboard"]`).
- `copyShareUrl()` — clicks Copy (requires the dialog open; throws with remediation otherwise).
- `closeDialog()` — clicks `.aqua-dialog-close-button`; no-op if closed.

## Natural Language → Methods
- "what state is this?" → `getStateName()`
- "who borders this state?" / "list neighboring states" → `getNeighborStates()`
- "go to Nebraska's profile" → `clickNeighborState("Nebraska")`
- "share this profile" / "copy the profile link" → `openShareDialog()` + `copyShareUrl()`

## State Fields
- `stateName: string` — Derived in `gatherState()`.
- `profileType: string` — Derived in `gatherState()`.
- `neighborStateCount: number` — Derived in `gatherState()`.
- `shareDialogOpen: boolean` — Derived in `gatherState()`.

## Gotchas
- **SHARE BUTTON ID EMBEDS THE STATE SLUG**: the id is `share-button_kansas` (lowercased state name). Select with the prefix matcher `button[id^="share-button_"]`, never the full id.
- **BACKDROP CLICK DOES NOT CLOSE DIALOGS**: clicking `.aqua-dialog-backdrop` is intercepted; only `.aqua-dialog-close-button` closes aqua dialogs. `closeDialog()` encodes this.
- The description also contains two invisible `router-link-active` anchors (stale hrefs with wrong FIPS) after the neighbor links — `getNeighborStates()` correctly returns only the visible `a.dynamic-link` items.
- A hidden `.PrintHeader` duplicates the name/description for print — scope reads to `.ProfileHeader`.
