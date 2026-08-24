---
type: Flow
title: Share the profile (dialog + copy URL)
description: Open the Share Profile dialog, copy the profile URL, close.
tags: [share, dialog, flow]
timestamp: 2025-01-20T00:00:00Z
---

# Share the profile

Applies to: [State Profile page](../page.md). Uses [Profile Header](../concepts/profile-header.md).

## Proven recipe

```js
await po.gatherState();       // before: shareDialogOpen: false
await po.openShareDialog();   // clicks button[id^="share-button_"]
await po.page.waitForTimeout(500); // dialog fade-in
await po.gatherState();       // after: shareDialogOpen: true
await po.copyShareUrl();      // button[title="Copy url to clipboard"]
await po.closeDialog();       // .aqua-dialog-close-button — backdrop clicks do NOT work
```

The dialog also exposes social targets via `po.getSocialShareButtons()` (`.SocialShareButton[aria-label="Share to X"]` etc.) — these open external windows.

Last validated: 2025-01-20 (open, copy button, close via close-button all verified live).
