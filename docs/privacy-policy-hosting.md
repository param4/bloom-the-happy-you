# Hosting the Privacy Policy on GitHub Pages

Google Play requires the privacy policy at a **public URL** — in-app text is not enough. This repo is set up so [privacy-policy.md](privacy-policy.md) (it already has the needed front matter) publishes cleanly via GitHub Pages.

## Target URL (use this in Play Console)

```
https://param4.github.io/bloom-the-happy-you/privacy-policy/
```

## Steps (one time, ~5 minutes)

1. **Make sure the repo is public.** Free GitHub Pages only works on public repos.
   - ⚠️ If you want the source code to stay **private**, don't flip this repo — instead create a tiny public repo (e.g. `bloom-privacy`), copy `docs/privacy-policy.md` into it as `index.md`, enable Pages there, and use `https://param4.github.io/bloom-privacy/` as the URL.
2. Commit & push the current `docs/` folder to `master`.
3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **master**, folder: **/docs** → Save.
4. Wait 1–2 minutes, then open the URL above and confirm the policy renders.
5. Paste the URL into **Play Console → App content → Privacy policy**, and use the same URL as the optional website in contact details if you like.

## Notes

- Everything in `docs/` becomes public on that site (these submission guides included). That's harmless — none of them contain secrets — but if you prefer, move the internal guides to a `docs-internal/` folder before enabling Pages; only `privacy-policy.md` must be published.
- The front matter block (`title` / `permalink`) at the top of `privacy-policy.md` is what makes GitHub Pages render it as a proper HTML page at the clean `/privacy-policy/` URL. Don't remove it.
- When you update the policy, just edit, commit, push — the page updates automatically. Remember to bump the effective date.
