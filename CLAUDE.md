# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bloom ("Meet the happy you") is a gentle wellbeing app built with **Expo SDK 54 (pinned)**, TypeScript, Expo Router, and NativeWind. `Draft.jsx` at the repo root is the original **web** React prototype kept only as a visual/behavioral reference — it is not part of the app and is excluded from `tsconfig`. All real code lives under `src/`.

## Commands

- `npx expo start` — dev server (then `i` / `a` for simulator, or scan the QR with Expo Go). Also `npm run ios` / `npm run android` / `npm run web`.
- `npx tsc --noEmit` — type-check. This is the primary correctness gate; there is **no test runner configured**.
- `npm run lint` — `expo lint`.
- `npx expo-doctor` — dependency/config health (should stay 17/17).
- `npx expo export --platform ios --output-dir <tmp>` — full Metro+NativeWind+Hermes bundle. Use this to verify a change compiles end-to-end when no simulator is available; a real Hermes `.hbc` under `_expo/static/js/ios/` means the whole graph bundled.

Ignore the `reset-project` script in package.json — its `scripts/` file was removed during setup.

## Critical constraints

- **Do not upgrade Expo past SDK 54** — it is deliberately pinned. After any dependency change run `npx expo install --fix`.
- **`babel-preset-expo` must stay `~54.0.11`.** npm's default resolves it to 57.x, which emits syntax the SDK 54 Hermes compiler rejects (bundle fails with a hermesc error). If bundling suddenly breaks, check this version first.
- **Tailwind must stay 3.4.x** (NativeWind v4 is incompatible with Tailwind v4).
- Third-party components need `cssInterop` before `className` works — registered once in `src/theme/interop.ts` (LinearGradient, CameraView, VideoView). Add new ones there.
- Metro-cache issues after config changes: `npx expo start -c`.

## Architecture

Strictly layered, dependency flowing inward. The whole point is that UI/state depend on **interfaces**, and concrete implementations are named in exactly one file.

```
domain/  →  repositories/  →  services/  →  state/  →  app/ + components/
(types)     (persistence)     (rules)       (zustand)   (Expo Router + UI)
```

- **`src/domain/`** — pure TS types, zero RN imports (Entry, JoyVideo, Manifestation, Todo, Profile, MoodLog, StreakState, Settings, ResurfaceItem).
- **`src/repositories/`** — persistence only, no business rules. Seven narrow interfaces in `interfaces.ts`; each AsyncStorage impl goes through the single `IKeyValueStore` (`storage/kvStore.ts`) which is the only place JSON (de)serialization happens. **Contract all impls honor:** list getters return `[]` and single getters `null` on absence — never throw. The app ships with no seed/dummy data — everything starts empty (streak 0, empty journals/vision/booth/todos).
- **`src/services/`** — one business rule per service: `ProfileService` (auth validation), `StreakService` (streak/grace math — pure `advanceStreak` is exported for testing), `ResurfaceService` + `MomentService` (random picks, with the picker injected via `random.ts` so they're deterministic in tests), `MediaStore` (copies volatile camera/picker cache URIs into `documentDirectory`), `NotificationService`.
- **`src/services/container.ts` is the composition root** — the **only** file allowed to name concrete repository/service classes (`new AsyncStorage*`, `new *Service`). `createContainer(overrides?)` enables test injection; `getContainer()` is the app singleton. If you add a repo/service, wire it here and expose it through `AppServices`. `ServicesProvider`/`useServices` surface it to components.
- **`src/state/`** — thin zustand stores that orchestrate services (e.g. `entriesStore.addEntry` persists via the repo then calls `StreakService`; it never touches storage directly). `hydration.ts` seeds + hydrates all stores; the root layout holds the splash screen until it resolves so the auth gate never sees half-hydrated state.
- **`src/app/`** — Expo Router routes only (params, gating, compose a screen component). Auth gate lives in `(app)/_layout.tsx` (redirects to `(auth)/welcome` when no profile — covers sign-out and deep links automatically). Modals (`lift-me-up`, `manifestation-moment` as `transparentModal`; `add-dream` as `modal`) are declared there too. Real UI lives in `src/components/{ui,home,pillar,vision,booth,todo,affirmations}/`.

When adding a feature, respect the layering: new persisted data → domain type + repo interface + AsyncStorage impl + wire in container; new rule → a service; UI state → a store; screen → route + components.

## Design system

Warm clay/terracotta identity with a **runtime-switchable accent theme** (terracotta / sage / blush), chosen in onboarding and the profile menu, persisted in `Settings.theme`.

- **Palette single source:** `src/theme/palette.js` (CommonJS) is imported by both `tailwind.config.js` and `src/theme/colors.ts`. It has fixed `BASE` colors + three `THEMES` accent triplets. Change colors there, nowhere else.
- **Theming is dual-track — this is the key pattern:**
  - `className` colors (`bg-accent`, `text-accent-deep`, `bg-accent-soft`) resolve to CSS variables. `ThemeProvider` (`src/theme/ThemeProvider.tsx`) fills them via NativeWind `vars()` on a wrapping View, so they recolor live.
  - Colors passed as **props** (lucide icon `color=`, `LinearGradient` tuples) can't use className — get them from `const { colors, gradients } = useTheme()`. `colors` = base + the active accent triplet.
  - Old per-family tokens (peach/lav/sage-light…) are gone; everything themeable is `accent`/`accentDeep`/`accentSoft`.
- **Fonts:** RN doesn't synthesize weights — each weight is its own family. `font-serif` = Fraunces (headings, greetings, entry & affirmation body), `font-body`/`font-body-extrabold` = Nunito (labels, buttons, nav). Use the Tailwind `font-*` classes.
- **Gradients** don't work via Tailwind in RN — use `GradientCard` (wraps `expo-linear-gradient`) with the accent-driven tuples from `useTheme().gradients`.
- **Shadows** are RN style objects in `theme/shadows.ts` (`soft`/`softer`/`accentGlow`), applied via `style=`, not className.
- **Modals:** route-based transparent modals use `ModalCard`; in-place modals (share card, recap, send, branded video, profile popover) use `OverlayModal` (an RN `Modal`). The app-level share-card modal is driven by `shareCardStore`; `BloomBurst` (celebration) by `burstStore` — both rendered once in the root layout.
- Animations use `react-native-reanimated` (FadeInDown entrances, `GlowView` pulse, `BloomBurst`, press-scale in `SoftButton`).

## Gotchas specific to this codebase

- **Dates use LOCAL calendar keys** via `src/lib/dates.ts` (`toDateKey`, `todayKey`, `parseDateKey`). The prototype's `toISOString().slice(0,10)` was UTC and broke streaks in timezones ahead of UTC — do not reintroduce ISO/UTC date handling.
- **Media:** there is no `URL.createObjectURL`/`MediaRecorder`. Camera/picker return volatile cache file URIs; always run them through `MediaStore.persistVideo`/`persistImage` before storing.
- **Camera/mic degrade on simulators:** `CameraStage`/`MiniVideoRecorder`/`VoiceRecorder` guard on `Device.isDevice` (or permission) and fall back to a uri-less "save a note" path. Camera recording, voice notes (expo-audio), notifications, and the native share sheet (view-shot + expo-sharing) only work fully on a physical device.
- **Storage is versioned** (`bloom/v2` in `storageKeys.ts`); bump the prefix on any breaking schema change — it orphans old data so the app starts clean.
