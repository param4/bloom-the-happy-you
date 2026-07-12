# 🌸 Bloom — Google Play Submission Master Checklist

Work top to bottom. Every item links to the doc with the exact content/answers.

## Phase 0 — Accounts & hosting
- [ ] Google Play **Individual developer account** active ($25 one-time, ID verification complete)
- [ ] Developer name set to **GM Studios - Learn & Grow** (Settings → Developer page)
- [ ] Privacy policy live at `https://param4.github.io/bloom-the-happy-you/privacy-policy/` → [privacy-policy-hosting.md](privacy-policy-hosting.md)
- [ ] 12+ Android testers recruited (emails collected) → why: [build-and-submit-guide.md](build-and-submit-guide.md)

## Phase 1 — Build
- [ ] (Recommended) add `"com.google.android.gms.permission.AD_ID"` to `android.blockedPermissions` in app.json → [app-content-declarations.md](app-content-declarations.md) §9
- [ ] `npx tsc --noEmit` clean, `npx expo-doctor` 17/17
- [ ] `eas build --platform android --profile production` → download `.aab`
- [ ] Smoke-test the production build on a real device (camera, voice note, notification reminder, share card)

## Phase 2 — Create app & declarations (Play Console → App content)
- [ ] Create app: **Bloom — The Happy You**, App, Free, en-US
- [ ] Privacy policy URL pasted
- [ ] App access: no restrictions → [app-content-declarations.md](app-content-declarations.md)
- [ ] Ads: **No**
- [ ] Content rating questionnaire → all No → Everyone/3+ → [content-rating-questionnaire.md](content-rating-questionnaire.md)
- [ ] Target audience: **13+ only** (13–15, 16–17, 18+)
- [ ] News app: No · COVID app: N/A · Government: No · Financial: none
- [ ] Data safety: **No data collected/shared** → [data-safety-form.md](data-safety-form.md)
- [ ] Advertising ID: **No**
- [ ] Account creation: **No** (no deletion URL needed)

## Phase 3 — Store listing (Grow → Store presence)
- [ ] App name, short & full description pasted → [play-store-listing.md](play-store-listing.md)
- [ ] Category: **Lifestyle**; tags set
- [ ] Contact email: **maheshwarigarima4@gmail.com**
- [ ] App icon 512×512 uploaded → [store-assets-checklist.md](store-assets-checklist.md)
- [ ] Feature graphic 1024×500 uploaded
- [ ] 2–8 phone screenshots uploaded

## Phase 4 — Closed testing (required 14 days)
- [ ] Closed track created, `.aab` uploaded, release notes pasted → [release-notes.md](release-notes.md)
- [ ] Tester email list added; opt-in link shared; **≥12 testers installed**
- [ ] Countries selected
- [ ] Day counter: started ____ / eligible ____ (14 days later)

## Phase 5 — Production
- [ ] "Apply for production" submitted and approved
- [ ] Production release created from the tested `.aab`
- [ ] Countries & rollout % chosen → **Roll out**
- [ ] Listing live 🎉 — save the store URL: `https://play.google.com/store/apps/details?id=io.github.param4.bloom`

## Documents in this pack

| File | What it's for |
|---|---|
| [privacy-policy.md](privacy-policy.md) | The policy itself (publish via GitHub Pages) |
| [privacy-policy-hosting.md](privacy-policy-hosting.md) | How to put it at a public URL |
| [play-store-listing.md](play-store-listing.md) | Copy-paste listing text (name, descriptions, category, contacts) |
| [data-safety-form.md](data-safety-form.md) | Exact Data safety answers + rationale |
| [content-rating-questionnaire.md](content-rating-questionnaire.md) | IARC answers → Everyone/3+ |
| [app-content-declarations.md](app-content-declarations.md) | Every other App-content question answered |
| [store-assets-checklist.md](store-assets-checklist.md) | Icon, feature graphic, screenshot specs & shot list |
| [release-notes.md](release-notes.md) | "What's new" text for v1.0.1 |
| [build-and-submit-guide.md](build-and-submit-guide.md) | EAS build, signing, 14-day closed test, production |
