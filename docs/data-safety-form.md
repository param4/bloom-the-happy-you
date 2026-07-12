# Data Safety Form — Exact Answers

**Play Console → Monitor and improve → Policy and programs → App content → Data safety**

Bloom collects **nothing**: no account, no analytics, no ads, and all user content (journals, videos, photos, moods, todos, streaks) lives only on the device. In Google's definition, data is "collected" only if it is **transmitted off the device** — Bloom never does that, so the form is short.

## Answers, in order

1. **Does your app collect or share any of the required user data types?**
   → **No**

2. That's it — answering **No** skips the rest of the questionnaire. Review the preview (it will show *"No data collected / No data shared"*) and **Submit**.

## Why "No" is the correct and honest answer

| Data in the app | Leaves the device? | Counts as "collected"? |
|---|---|---|
| Journal entries, voice notes, videos, photos | Never — stored in app documents directory | No |
| Mood logs, todos, streaks, settings | Never — AsyncStorage on device | No |
| Name typed in onboarding (profile) | Never — local only, no server | No |
| Analytics / crash reporting | None integrated | No |
| Advertising | No ads, no ad SDKs | No |

The native share sheet (sharing a "share card" image) is **user-initiated sharing to an app the user picks** — Google explicitly excludes this from "data sharing".

## Related declarations (same App content page)

- **Privacy policy:** paste `https://param4.github.io/bloom-the-happy-you/privacy-policy/`
- **Account deletion:** when asked *"Does your app allow users to create an account?"* → **No** (there is no sign-up in this release). The account-deletion-URL requirement therefore does not apply.
- **Advertising ID:** → **No, my app does not use advertising ID.** Bloom includes no ad or analytics SDK. (Optional hardening: add `"com.google.android.gms.permission.AD_ID"` to `android.blockedPermissions` in app.json so no stray library can ever merge it in — see the checklist.)

## ⚠️ If you ever re-enable accounts/login

Before shipping that build, update BOTH:
- This form: Personal info → Email address, Name → collected, for account management; and provide an account deletion URL/flow.
- The privacy policy (new effective date, account section restored).
