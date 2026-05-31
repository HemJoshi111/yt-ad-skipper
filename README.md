
<div align="center">

<img src="assets/youtube-logo.svg" alt="YT Ad Skipper logo" width="160" height="160" />

<h1 style="margin:10px 0 6px 0">YT Ad Skipper</h1>

<p style="margin:0 0 10px 0; color:#555; font-size:18px">Lightweight Chrome MV3 extension that auto-skips, hides, and reduces YouTube ad interruptions (experimental)</p>

<p>
  <a href="https://github.com/HemJoshi111/yt-ad-skipper"><img src="https://img.shields.io/badge/Repo-HemJoshi111/yt--ad--skipper-24292f?logo=github&logoColor=white" alt="repo"/></a>
  <img src="https://img.shields.io/badge/Manifest-MV3-red" alt="manifest" />
  <img src="https://img.shields.io/badge/Browser-Chrome-4285f4" alt="chrome" />
  <img src="https://img.shields.io/badge/Status-Experimental-yellow" alt="experimental" />
</p>

</div>

Lightweight Chrome MV3 extension to reduce YouTube ad interruptions by combining declarativeNetRequest rules and a DOM content script that auto-skips or hides ads when possible.

- Repository: https://github.com/HemJoshi111/yt-ad-skipper

## Overview

This repository contains a minimal Manifest V3 Chrome extension that attempts to block certain ad/tracking requests and automatically skip or hide YouTube ads using a content script.

- Blocks explicit tracking host(s) via `declarativeNetRequest` static rules.
- Uses a content script to click the Skip button, fast-forward skippable ads, and hide some ad DOM elements.

This project is intentionally small so you can inspect and extend it easily.

## Quick Verdict

This extension is structurally valid and loadable in Chrome, but it is not a robust, comprehensive YouTube ad blocker. It can help skip some skippable ads and block a narrow set of third-party hosts, but it won't reliably stop the full range of ad delivery endpoints used by YouTube.

## Files of Interest

- [manifest.json](manifest.json)
- [rules.json](rules.json)
- [scripts/content.js](scripts/content.js)
- [_metadata/generated_indexed_rulesets/_ruleset1](_metadata/generated_indexed_rulesets/_ruleset1)

## How It Works (short)

- `manifest.json` declares an MV3 extension with `declarativeNetRequest` static rules (loaded from `rules.json`) and a content script that runs on YouTube pages.
- `rules.json` contains static DNR rules that the browser's declarative network layer enforces (the current rule targets doubleclick.net subresources).
- `scripts/content.js` runs in the page context and tries to:
  - Click YouTube's Skip Ad button when present.
  - Jump video playback to the end of the ad overlay when the player indicates an ad is showing.
  - Hide some ad DOM elements like banner slots.

## Limitations & Notes

- DeclarativeNetRequest static rules are sandboxed and intentionally limited by Chrome; complex regexes or large rule sets may need manifest packaging or indexed rulesets.
- YouTube serves ads from many domains and via dynamically-signed URLs; a single static rule rarely covers everything.
- Content-script manipulations are brittle: YouTube frequently changes DOM class names and ad UX patterns, which can break the skip/hide logic.
- This project is for educational/experimental use. Do not use for malicious or policy-violating behavior.

## Getting Started - How to Load Locally

1. Clone the repository

```bash
git clone https://github.com/HemJoshi111/yt-ad-skipper.git
cd yt-ad-skipper
```

2. Open Chrome and go to `chrome://extensions`

3. Enable `Developer mode` (top-right)

4. Click `Load unpacked` and choose this project's root folder

After loading, Chrome will install the MV3 extension and apply the static DNR rules declared in `manifest.json`.

## How to Test (manual)

1. Open a YouTube video that displays ads (use an un-signed-in profile or a test video known to show ads).
2. Open DevTools (F12) on the video tab and watch the Console for any messages from `content.js` (you can add logs for development).
3. Observe behavior:
   - For skippable pre-roll ads, the extension's content script should attempt to click the Skip button.
   - For some unskippable ads the script will try to fast-forward by moving `video.currentTime` to the ad's end.
   - Network requests to blocked hosts in `rules.json` (for example doubleclick.net) should be prevented by Chrome's declarativeNetRequest layer.

Verification tips:
- Use the Network tab to inspect blocked requests.
- Use the Elements tab to confirm banner ad nodes are hidden or removed.

## How to Modify / Harden

1. Expanding network blocking rules

- Edit `rules.json` to add more declarativeNetRequest rules. Example rule to block `pagead2.googlesyndication.com` resources:

```json
{
  "id": 2,
  "priority": 1,
  "action": { "type": "block" },
  "condition": {
    "urlFilter": "*://*.pagead2.googlesyndication.com/*",
    "resourceTypes": ["script", "image", "xmlhttprequest"]
  }
}
```

- After editing `rules.json` reload the extension in `chrome://extensions` (click the reload icon) to apply the changed static ruleset.

2. Using dynamic DNR rules at runtime

- For more flexible control, add a background service worker that calls `chrome.declarativeNetRequest.updateDynamicRules()` to add/remove rules programmatically.
- This is useful for toggling rules without editing files and reloading.

3. Making the content script more resilient

- Avoid brittle class selectors; prefer feature-detection or multiple selector fallbacks.
- Add mutation observers to respond to dynamic changes rather than polling only (or combine both).
- Add a debug mode that logs activity to make it easier to reason about failures.

## Example: Add a dynamic rule (concept)

Add a background service worker (`background.js` in manifest `background.service_worker`) and call:

```js
chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [ /* rule objects like in rules.json */ ],
  removeRuleIds: []
});
```

Dynamic rules are limited to a maximum number per extension; consult Chrome docs for current limits.

## Development Tips

- Syntax checks: Ensure `manifest.json` and `rules.json` are valid JSON.
- Quick JS syntax check for `scripts/content.js`:

```bash
node --check scripts/content.js
```

- When editing, reload the extension and refresh the YouTube page to observe changes.

## Troubleshooting

- If your changes to `rules.json` don't appear to apply, reload the extension and check `chrome://extensions` for errors.
- If the content script doesn't run, confirm the `matches` pattern in `manifest.json` matches the page URL and that you reloaded the extension.
- Use the extension's inspectable views: on `chrome://extensions` click `Inspect views` for the background/service worker (if present) and check console errors.

## Suggested Improvements

- Expand `rules.json` with a curated list of YouTube ad endpoints (be mindful of false-positives).
- Add a background service worker to manage dynamic rules and provide an options UI for toggling features.
- Implement a small options page for toggles like `auto-skip`, `hide-banners`, or `aggressive-network-blocking`.

## Contributing

Contributions welcome. Typical flow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear summary and testing instructions

## Author

[![Er. Hem Joshi](https://img.shields.io/badge/Er.%20Hem%20Joshi-1F2937?style=flat&logo=github&logoColor=white)](https://github.com/HemJoshi111)

## License

No license file included. If you intend to publish or share widely, consider adding an explicit OSS license (for example MIT).
