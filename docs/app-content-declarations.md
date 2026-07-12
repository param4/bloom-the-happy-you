# App Content Declarations — Every Question, Every Answer

**Play Console → App content** shows a list of declarations. Here is the answer for each one for Bloom v1.0.1 (guest-only, fully offline release).

## 1. Privacy policy
Paste: `https://param4.github.io/bloom-the-happy-you/privacy-policy/`
(Make it live first — see [privacy-policy-hosting.md](privacy-policy-hosting.md).)

## 2. App access
> *"All or some functionality in my app is restricted?"*

Select: **All functionality is available without special access** — Bloom has no login at all, so reviewers can use everything immediately. No credentials needed.

## 3. Ads
> *"Does your app contain ads?"*

**No.** (No ad SDKs, no cross-promotion, no banners.)

## 4. Content ratings
Complete the IARC questionnaire — answers in [content-rating-questionnaire.md](content-rating-questionnaire.md). Expected: **Everyone / 3+**.

## 5. Target audience and content
- **Target age groups:** select **13–15, 16–17, and 18+**. Do **not** select any group under 13 — that pulls the app into Google's Families policy (extra requirements). This matches the privacy policy ("not directed at children under 13").
- **"Could your store listing unintentionally appeal to children?"** → **No** — the listing is about adult self-reflection, journaling, and wellbeing; imagery is abstract line-art flowers, not child-directed characters.

## 6. News apps
**No** — Bloom is not a news app.

## 7. COVID-19 contact tracing and status apps
**Not a contact tracing or status app.**

## 8. Data safety
Full walkthrough in [data-safety-form.md](data-safety-form.md). Summary: **No data collected, no data shared.**

## 9. Advertising ID
**No** — the app does not use the advertising ID.
Optional hardening (recommended before the production build): in `app.json` add to the existing `android.blockedPermissions` array:
```json
"com.google.android.gms.permission.AD_ID"
```
This guarantees no dependency can ever merge that permission into the manifest, keeping the declaration true forever.

## 10. Government apps
**No** — not developed for/on behalf of a government.

## 11. Financial features
**My app doesn't provide any financial features.**

## 12. Health apps
If the console shows the **Health apps** declaration: Bloom is a personal journaling/self-care app, **not** a medical device, health research, or clinical app.
- If asked to categorize: the closest fit is **"Health and wellness" → mood tracking / wellbeing**, with no medical functionality.
- It does not connect to Health Connect, sensors, or wearables.
- Staying in the **Lifestyle** category usually means this declaration doesn't apply at all.

## 13. Account deletion
> *"Does your app allow users to create an account?"*

**No.** There is no sign-up in this release, so no deletion URL is required. (Revisit immediately if login ships later.)

## 14. App permissions (sensitive-permission declaration)
Bloom requests only **CAMERA**, **RECORD_AUDIO**, **MODIFY_AUDIO_SETTINGS**, and **POST_NOTIFICATIONS** (added by expo-notifications). None of these are in Google's "sensitive/restricted" list (SMS, Call Log, background location, All-files access, Accessibility) — **no special declaration form will appear**. Photos are accessed through the Android photo picker, which needs no storage permission (READ/WRITE_EXTERNAL_STORAGE are explicitly blocked in app.json — good).

---

### Not required (FYI)
- **Terms of service** — Google does not require one; optional for a free offline app.
- **US state privacy / GDPR data-processing agreements** — not applicable, since no personal data is collected or processed off-device.
- **Export compliance / encryption declarations** — a Play upload does not ask for this (that's an App Store thing); the app uses only standard OS-level storage.
