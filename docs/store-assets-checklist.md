# Store Assets Checklist (graphics you must prepare)

These are uploaded in **Main store listing**. All are required unless marked optional.

## 1. App icon — required
- **512 × 512 px**, 32-bit PNG, ≤ 1 MB, **no transparency** (Google flattens it).
- Export a hi-res version of the existing line-art flower icon (`assets/images/icon.png` is the source design). It must match the installed app's icon.
- Google applies its own rounded mask — keep the mark centered with comfortable padding, like the adaptive icon already does.

## 2. Feature graphic — required
- **1024 × 500 px**, PNG or JPEG, no transparency.
- Shown at the top of the listing (and behind the promo video if you add one).
- Suggested design: warm cream `#FBF7F0` background, the flower mark on the left, and on the right in Fraunces: **"Bloom"** with the subtitle *"The happy you."* Keep text large — it's often displayed small.
- Avoid: screenshots collaged in, tiny text, "Download now" calls to action (policy risk).

## 3. Phone screenshots — required (minimum 2, up to 8)
- PNG/JPEG, 16:9 or 9:16, each side between 320 and 3840 px. Recommended: **1080 × 2400 portrait**.
- Capture on a real device or emulator (Pixel works well). Suggested set, in order:
  1. **Home** — greeting, streak, mood check-in (the "wow, it's warm" shot)
  2. **Journal entry** — writing or a voice/video entry
  3. **Joy Booth** — recording a happy moment
  4. **Lift Me Up** — the resurfaced-memory modal
  5. **Dream board** — vision board with photos
  6. **Manifestation moment** — the transparent modal
  7. **To-dos** — the gentle list
  8. **Theme picker / profile** — terracotta, sage, blush
- Tips: use a fresh install with a little pleasant sample content you create by hand (real UI only — no mockups that misrepresent the app), status bar clean (full battery, no notification icons).

## 4. Tablet screenshots — optional
- 7" and 10" sets improve tablet-search placement. The app is phone-focused (`supportsTablet: false` on iOS); skip for launch — Android tablets can still install unless you restrict them.

## 5. Promo video — optional
- A YouTube URL. Skip for launch; add later if you make one.

## 6. What's-new text
- See [release-notes.md](release-notes.md) — entered per release, max 500 characters.

## Quick reference table

| Asset | Size | Format | Required |
|---|---|---|---|
| App icon | 512×512 | PNG (no alpha) | ✅ |
| Feature graphic | 1024×500 | PNG/JPEG | ✅ |
| Phone screenshots | 1080×2400 (2–8) | PNG/JPEG | ✅ (min 2) |
| 7"/10" tablet screenshots | up to 8 each | PNG/JPEG | Optional |
| Promo video | YouTube link | — | Optional |
