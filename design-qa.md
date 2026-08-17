# Design QA — Jan Tar Art Catalog

## Comparison target

- Source visual truth: `qa/qa-reference-old-catalog.png`
- Final desktop implementation: `qa/qa-implementation-desktop.png`
- Detail-dialog implementation: `qa/qa-implementation-dialog.png`
- Mobile implementation: `qa/qa-implementation-mobile.png`
- Viewport: desktop CSS viewport 1280×720; mobile CSS viewport 390×844
- Pixel dimensions and density:
  - Source: 1265×712 px, desktop CSS viewport 1280×720, density 1
  - Final desktop: 1265×712 px, desktop CSS viewport 1280×720, density 1
  - Dialog: 1280×720 px, desktop CSS viewport 1280×720, density 1
  - Mobile: 375×811 px, mobile CSS viewport 390×844, density 1
- Compared state: catalog landing screen at the top of the page; final desktop uses the default Russian locale. The dialog evidence shows work #100 in English.

## Full-view comparison evidence

The rebuild preserves the source system’s defining visual structure: a sticky charcoal header, a near-black centered hero, warm red-orange accent, high-contrast sans-serif typography, and a four-column desktop gallery of real artwork photographs on dark surfaces. The gallery remains the dominant visual material and the first row is visible in the desktop viewport.

Intentional rebuild changes are the current `Jan Tar` identity, RU/EN switching, canonical inventory counts, catalog search and filters, visible price/size metadata, and an accessible detail viewer. These additions support the requested catalog rebuild and do not replace or imitate any supplied artwork assets.

## Focused-region comparison evidence

- Header and hero: source and implementation use the same dark hierarchy and orange accent; the implementation tightens the hero so work imagery remains visible above the fold.
- Gallery: every card uses the supplied repository photograph, with the source’s four-column desktop density and restrained rounded corners. No generated, placeholder, SVG, CSS-art, or div-art imagery is used.
- Detail viewer: the old lightbox pattern is retained and upgraded with thumbnails, image counters, work-to-work navigation, bilingual descriptions, and complete catalog metadata.
- Filters: native labeled inputs use the same dark tokens and remain usable at desktop, two-column tablet, and one-column mobile breakpoints.

## Required fidelity surfaces

- Fonts and typography: system sans stack matches the source’s neutral UI character; heading scale, weights, wrapping, line height, and small uppercase labels were checked at desktop and mobile. Russian labels no longer clip in the sort control.
- Spacing and layout rhythm: header, hero, collection heading, filter row, four-column grid, card padding, and modal split were visually checked. Desktop, 768 px tablet, and 390 px mobile layouts have zero horizontal overflow.
- Colors and visual tokens: near-black backgrounds, charcoal surfaces, quiet grey borders, off-white text, muted secondary copy, and orange-red accent consistently map to the source.
- Image quality and asset fidelity: the first 24 rendered images loaded at 2000 px natural width. The catalog verifier confirms that all 258 repository images are referenced exactly once across 128 works. #228 files are correctly treated as detail views of #227.
- Copy and content: RU/EN interface copy is coherent; all 127 complete works retain EN/RU descriptions, price, size, material, location, and SKU. #123 is explicitly marked as unverified instead of presenting invented data.
- Accessibility and behavior: semantic labels, visible focus rings, reduced-motion handling, keyboard Escape/Arrow navigation, modal body lock, descriptive alt text, and practical mobile target sizes were checked.

## Comparison history

### Iteration 1

- Evidence: `qa/qa-iteration-1-desktop.png`
- [P2] The initial hero was too tall and pushed the artwork grid entirely below the desktop fold.
- Fix: reduced hero height and heading scale; tightened collection and filter spacing.

### Iteration 2

- Evidence: `qa/qa-iteration-2-desktop.png`
- Post-fix: the first artwork row became visible, restoring the source’s image-led first screen.
- [P2] The Russian sort label was visually clipped by the native select arrow.
- Fix: widened the sort column and shortened localized sort labels without changing meaning.

### Final pass

- Evidence: `qa/qa-implementation-desktop.png`
- The first artwork row is visible, filter labels fit, no horizontal overflow remains, and no actionable P0/P1/P2 visual issues remain.

## Primary interactions tested

- Search for `Whispers of Dawn` returns the single canonical #150 record.
- Status filter `На проверке` returns only #123.
- Filter reset restores all 128 works.
- RU/EN switch updates navigation, filters, counts, metadata, and descriptions.
- Opening #100 shows two loaded images, complete metadata, and the correct inquiry subject.
- Next-image navigation changes the counter from 1/2 to 2/2.
- Next-work navigation advances from #100 to #101 and resets the image counter.
- Closing the dialog removes it and restores page scrolling.
- Desktop, tablet, and mobile breakpoints render without horizontal overflow.
- Browser console: no warnings or errors.

## Build checks

- `node scripts/verify-catalog.mjs`: passed
- `pnpm run build`: passed
- `pnpm run test:sites`: 4/4 passed

## Follow-up polish

- P3: a future content pass may add verified Dutch descriptions once the NL database can be matched safely by SKU and image.

final result: passed
