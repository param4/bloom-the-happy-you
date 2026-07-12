# Build & Submit Guide — EAS → Play Console

How to produce the signed `.aab` Google Play needs, and how to get from zero to production on a **new Individual developer account**.

## ⚠️ The big one: 14-day / 12-tester rule

Personal (Individual) developer accounts created after Nov 13, 2023 **cannot publish straight to production**. Google requires:

- A **closed test** running with **at least 12 testers opted-in continuously for 14 days**, then
- You **apply for production access** in the console (they ask a few questions about your testing).

Plan for this: recruit 12+ friends/family with Android phones *now*, get the closed test live, and use the 2 weeks to polish assets. (Accounts created before that date, or Organization accounts, skip this.)

## 1. Build the production AAB

Prereqs: `npm i -g eas-cli`, logged in to the `param.expo` Expo account (project ID is already in app.json).

```bash
cd bloom-the-happy-you
npx expo install --fix        # sanity: SDK-54-aligned deps
npx tsc --noEmit              # type gate
eas build --platform android --profile production
```

- The `production` profile already has `autoIncrement: true` — EAS bumps `versionCode` automatically (versionSource is `remote`).
- Output is an **.aab** (App Bundle) — exactly what Play wants. Download it from the EAS build page.

## 2. App signing (nothing to do, but understand it)

- On the first build EAS generates and stores the **upload keystore** for you. Say yes when it offers to manage credentials. **Never lose access to the Expo account** — that keystore is how you ship updates.
- In Play Console, when creating the app you'll be enrolled in **Play App Signing** (Google holds the final signing key; your EAS keystore is the upload key). Accept the default.

## 3. Create the app in Play Console

**All apps → Create app**:
- App name: `Bloom — The Happy You`
- Default language: English (United States)
- App or game: **App** · Free or paid: **Free** (⚠️ irreversible once published)
- Accept declarations.

Then work through the **Set up your app** dashboard checklist — every answer is pre-written in this docs folder:
- Privacy policy → [privacy-policy-hosting.md](privacy-policy-hosting.md)
- App access, ads, content rating, target audience, data safety, etc. → [app-content-declarations.md](app-content-declarations.md), [data-safety-form.md](data-safety-form.md), [content-rating-questionnaire.md](content-rating-questionnaire.md)
- Store listing text + graphics → [play-store-listing.md](play-store-listing.md), [store-assets-checklist.md](store-assets-checklist.md)

## 4. Closed testing track (the required first release)

1. **Testing → Closed testing → Create track** (the default "Alpha" track is fine).
2. **Create release** → upload the `.aab` from step 1 → paste release notes from [release-notes.md](release-notes.md).
3. **Testers tab** → create an email list with your 12+ testers' Google-account emails.
4. Roll out. Share the opt-in link with testers; each must tap it and **install the app**.
5. Countries: add your target countries (at minimum India + wherever testers are).
6. Keep ≥12 testers opted in for **14 consecutive days** (nudge them to actually open the app now and then).

## 5. Apply for production

- After 14 days, **Dashboard → Apply for production**. Answer honestly: who tested, what feedback you got, what you fixed.
- Approval typically takes a few days. Then **Production → Create release**, reuse (or rebuild) the `.aab`, select countries, roll out. First production review commonly takes ~1–7 days.

## 6. Optional: submit from the CLI later

`eas submit -p android` automates uploads, but it needs a Google Cloud **service account JSON** linked to the Play account — for the first release the manual upload above is simpler. Set up CLI submission once the app exists.

## Version bumps for future releases

- Bump `version` in app.json (e.g. `1.0.2`) — `versionCode` auto-increments via EAS.
- Rebuild with the same command; upload to a track; promote when happy.
