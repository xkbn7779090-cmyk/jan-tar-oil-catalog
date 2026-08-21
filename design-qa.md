# Design QA — Jan Tar editorial redesign

## Comparison target

- Source visual truth: C:\Users\User\.codex\generated_images\01a00f99-1ee6-7573-aa83-8c47bfe13445\exec-2f9c5ab7-1775-4fef-8c95-c66782e9da0c.png
- Source pixels: 864 × 1821, density 1×.
- Implementation URL: http://127.0.0.1:4174/
- Browser-rendered implementation evidence:
  - qa/qa-redesign-hero-final.png
  - qa/qa-redesign-about-final.png
  - qa/qa-redesign-collection-final.png
  - qa/qa-redesign-mobile-iteration-1.png
  - qa/qa-redesign-mobile-about-iteration-1.png
  - qa/qa-redesign-mobile-collection-iteration-1.png
  - qa/qa-redesign-mobile-dialog-iteration-1.png
- Desktop CSS viewport: 864 × 900, devicePixelRatio 1. The in-app browser surface emitted 849 × 837 PNG frames; the final comparison normalizes those frames to the source's 864 px width.
- Mobile CSS viewport: 390 × 844, devicePixelRatio 1.
- State: Russian, editorial selection, default filters, 128 catalogue records.

## Full-view comparison evidence

- Combined side-by-side comparison: qa/design-qa-comparison-final.png.
- The board places the source on the left and normalized implementation captures on the right for the hero, artist story and first catalogue view.
- Overall composition, section order, warm-ivory field, vermilion accent, serif/sans hierarchy, studio artwork cluster, split biography and three-column catalogue match the chosen direction.

## Focused region evidence

- Hero: qa/qa-redesign-hero-final.png
  - One-row header at the reference breakpoint.
  - Title, actions and three catalogue metrics align with the reference rhythm.
  - Real works #100, #150, #182 and #227 reproduce the selected layered studio composition.
- Artist story: qa/qa-redesign-about-final.png
  - The 45/55 text-to-image split, editorial title, facts and close-up impasto crop are preserved.
  - Copy uses verified, non-sensitive facts only.
- Catalogue: qa/qa-redesign-collection-final.png
  - Compact toolbar, six functional controls and three editorial columns match the source density.
  - Canonical titles, sizes, media and prices replace the mock's invented placeholders.
- Mobile: the four mobile evidence files above confirm the stacked hero, readable biography, single-column catalogue, full-screen artwork dialog and zero horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: self-hosted Prata for display typography and Manrope for navigation, controls and metadata. Cyrillic and Latin subsets are included. Weight, line height, wrapping and hierarchy match the source closely.
- Spacing and layout rhythm: 68 px desktop header, roughly 700 px hero, 440 px artist split and compact catalogue toolbar reproduce the reference proportions. Square corners, hairline rules and restrained shadows are maintained.
- Colors and tokens: warm paper #f7f4ef, ink #181714, muted grey-brown, rules and vermilion #c84408 map directly to the visual target. No gradients were introduced.
- Image quality and asset fidelity: hero and artist-section imagery uses the original high-resolution artwork photographs, stored locally for the critical path. Catalogue cards retain the canonical 258-image archive. Phosphor supplies the small line icons; there are no placeholder, emoji, div-art or handcrafted SVG substitutes.
- Copy and content: RU/EN navigation and catalogue copy work end to end. The biography states the verified artist, musician and cultural-organiser practice, Limburg/Netherlands context, 200+ paintings and KSA founding in 2024. Sensitive residency, housing and health details are excluded.

## Primary interactions tested

- RU/EN switch updates the page language and hero copy.
- Search for 227 returns exactly one work.
- Artwork #227 opens the dialog; image navigation advances from 1 / 4 to 2 / 4; close works.
- Review-status filter returns exactly #123.
- Price descending starts at #227.
- Load more increases rendered cards from 18 to 36.
- Header anchors reach Works, About and Contact.
- Browser console warnings/errors checked: none.

## Comparison history

### Iteration 1

- Earlier evidence: qa/qa-redesign-hero-iteration-2.png, qa/qa-redesign-about-iteration-1.png, qa/qa-redesign-collection-iteration-1.png.
- Findings:
  - [P1] The 864 px breakpoint changed to a two-row header, stacked artist section and two-column catalogue, unlike the source.
  - [P2] Extra hero intro copy pushed actions and metrics down.
  - [P2] Artist section and catalogue introduction were substantially taller than the source.
- Fixes:
  - Restored the one-row header, split artist layout and three-column catalogue through 864 px.
  - Removed the extra hero paragraph and realigned the actions/metrics.
  - Compacted the biography and removed the visible catalogue title while preserving its accessible heading.

### Iteration 2

- Earlier evidence: qa/qa-redesign-hero-iteration-3.png, qa/qa-redesign-about-iteration-2.png, qa/qa-redesign-collection-iteration-2.png.
- Findings:
  - [P2] The tall painting and three foreground works did not yet match the reference's exact scale and vertical placement.
  - [P2] The impasto crop was less intimate than the source.
- Fixes:
  - Tuned each artwork's desktop position and dimensions independently using the original photographs.
  - Enlarged and refocused the real impasto detail crop.
  - Adjusted the first catalogue image ratio to match the reference's portrait rhythm.

### Final pass

- Post-fix evidence: qa/design-qa-comparison-final.png and the final section captures.
- No actionable P0, P1 or P2 differences remain.

## Follow-up polish

- [P3] The verified biography is slightly longer than the ImageGen mock, intentionally trading a small amount of whitespace for accurate artist context.
- [P3] Native select arrows vary slightly by operating system; the catalogue remains visually restrained and fully accessible.

final result: passed
