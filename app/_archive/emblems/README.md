# Archived badge emblems

Candidate artwork for the hero ID plate, kept for later. **Nothing here is imported by the site**:
the folder name starts with an underscore, so Next.js does not route it, and no live file references it.

The shipped badge is `app/components/FingerprintDie.tsx` (fingerprint pressed onto a chip).

Contents:

- `SunLeaf.tsx` - the original sun-and-lotus badge
- `Emblems.tsx`, `Emblems2.tsx`, `Terrain.tsx`, `Gyroscope.tsx`, `Wireframe.tsx` - 17 other candidates (A to Q)
- `registry.tsx` - id to artwork map, and one-line notes on each
- `store.ts`, `BadgeArt.tsx`, `EmblemSwitch.tsx` - the floating "Badge study" switcher used to cycle
  through them live on the page
- `Gallery.tsx` - a side-by-side gallery page (rename to `page.tsx` under a routed folder to view it)
- `emblems.css` - styles for all of the above (including the SunLeaf styles that used to live in globals.css)

To audition them again: in `app/page.tsx`, import `BadgeArt` and `EmblemSwitch` from this folder, render
`<BadgeArt />` in place of `<FingerprintDie />` inside `.billboard`, and render `<EmblemSwitch />` anywhere
on the page. Remove both when done.
